import sys
import subprocess
import time
from typing import List
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, HTTPException, status, Depends
from database import supabase
from models import (
    SubmissionCreate,
    SubmissionCreateResponse,
    SubmissionDetail,
    LessonResponse,
    UnitResponse,
    ModuleResponse,
    UserProgressResponse,
    ProgressUpdateRequest,
    LeaderboardEntry
)
from worker import queue_submission
from auth import get_current_user
from security import validate_student_code

router = APIRouter(prefix="/api/v1", tags=["Student"])

@router.get("/auth/me")
def get_my_profile(current_user: dict = Depends(get_current_user)):
    """Returns the authenticated user's profile and gamification stats."""
    return current_user

@router.post("/auth/auto-confirm")
def auto_confirm_user(payload: dict):
    """Auto-confirms a user's email using Supabase service role admin."""
    email = payload.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    try:
        users = supabase.auth.admin.list_users()
        target = [u for u in users if u.email == email]
        if target:
            supabase.auth.admin.update_user_by_id(target[0].id, {"email_confirm": True})
            return {"status": "confirmed", "email": email}
        return {"status": "not_found"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.post("/submissions", response_model=SubmissionCreateResponse, status_code=status.HTTP_201_CREATED)
def submit_code(payload: SubmissionCreate):
    """
    Submits student code to the Celery + Redis Distributed Task Queue.
    The Celery Worker node executes the task inside an AST Hardened Sandbox.
    Waits for worker result via Redis; falls back to async polling or local execution if queue is busy.
    """
    start_time = time.time()

    # 1. Resolve lesson_id to UUID if a numeric string was sent
    real_lesson_id = payload.lesson_id
    if real_lesson_id.isdigit():
        try:
            idx = int(real_lesson_id)
            all_l = supabase.table("lessons").select("id").order("order_index").execute().data or []
            if 1 <= idx <= len(all_l):
                real_lesson_id = all_l[idx - 1]["id"]
        except Exception:
            pass

    # 2. Insert initial submission record with status 'queued'
    sub_id = "sub-" + str(int(time.time() * 1000))
    try:
        ins_res = supabase.table("submissions").insert({
            "user_id": payload.user_id,
            "lesson_id": real_lesson_id,
            "submitted_code": payload.code,
            "language": payload.language,
            "status": "queued",
            "passed": False,
            "output": "",
            "error": "",
            "execution_time_ms": 0
        }).execute()
        if ins_res.data and len(ins_res.data) > 0:
            sub_id = ins_res.data[0]["id"]
    except Exception as e:
        print(f"Failed to insert queued submission: {e}")

    # 3. Distributed Execution: Dispatch to Redis Message Broker & Celery Worker
    try:
        from worker import execute_code_task
        task = execute_code_task.delay(
            submission_id=sub_id,
            code=payload.code,
            lang=payload.language,
            is_practice=payload.is_practice
        )
        
        # Non-blocking check for fast Celery execution (up to 2.5s)
        poll_start = time.time()
        while time.time() - poll_start < 2.5:
            if task.ready():
                result = task.result
                if isinstance(result, dict):
                    return SubmissionCreateResponse(
                        submission_id=sub_id,
                        status=result.get("status", "completed"),
                        passed=result.get("passed", False),
                        output=result.get("output", ""),
                        error=result.get("error", ""),
                        execution_time_ms=result.get("execution_time_ms", int((time.time() - start_time) * 1000))
                    )
                break
            time.sleep(0.05)
            
        # Return queued status so frontend polling seamlessly takes over
        return SubmissionCreateResponse(
            submission_id=sub_id,
            status="queued",
            passed=False,
            output="",
            error="",
            execution_time_ms=int((time.time() - start_time) * 1000)
        )
    except Exception as dist_err:
        print(f"[Distributed Dispatch Fallback] Queue error: {dist_err}")
        # Local resilience fallback
        from security import validate_code_ast
        is_safe, sec_warning = validate_code_ast(payload.code)
        if not is_safe:
            output = ""
            error = sec_warning
            passed = False
        else:
            clean_env = {"PYTHONIOENCODING": "utf-8", "PYTHONUNBUFFERED": "1"}
            try:
                run_res = subprocess.run(
                    [sys.executable, "-I", "-E", "-c", payload.code],
                    capture_output=True,
                    text=True,
                    timeout=3.0,
                    env=clean_env
                )
                output = run_res.stdout
                error = run_res.stderr
                passed = (run_res.returncode == 0) and not error
            except Exception as ex:
                output = ""
                error = str(ex)
                passed = False

        # Verify against lesson expected output if available
        xp_reward = 15
        try:
            lesson_res = supabase.table("lessons").select("exercise_data, xp_reward").eq("id", real_lesson_id).execute()
            if lesson_res.data and len(lesson_res.data) > 0:
                l_data = lesson_res.data[0]
                xp_reward = l_data.get("xp_reward", 15)
                ex_data = l_data.get("exercise_data") or {}
                expected_output = ex_data.get("expectedOutput", "")
                if expected_output and is_safe:
                    passed = (output.strip() == expected_output.strip()) and (run_res.returncode == 0)
        except Exception:
            pass

        status_str = "completed" if passed else "error"
        exec_ms = int((time.time() - start_time) * 1000)
        try:
            supabase.table("submissions").update({
                "status": status_str,
                "passed": passed,
                "output": output,
                "error": error,
                "execution_time_ms": exec_ms
            }).eq("id", sub_id).execute()
        except Exception:
            pass

        # Gamification Update in Fallback
        try:
            user_res = supabase.table("users").select("xp, hearts").eq("id", payload.user_id).execute()
            if user_res.data and len(user_res.data) > 0:
                curr_xp = user_res.data[0].get("xp", 0)
                curr_hearts = user_res.data[0].get("hearts", 5)
                if passed:
                    reward = 5 if payload.is_practice else xp_reward
                    supabase.table("users").update({"xp": curr_xp + reward}).eq("id", payload.user_id).execute()
                else:
                    if not payload.is_practice:
                        new_h = max(0, curr_hearts - 1)
                        upd = {"hearts": new_h}
                        if curr_hearts == 5 and new_h < 5:
                            upd["last_heart_update"] = datetime.now(timezone.utc).isoformat()
                        supabase.table("users").update(upd).eq("id", payload.user_id).execute()
        except Exception:
            pass

        return SubmissionCreateResponse(
            submission_id=sub_id,
            status=status_str,
            passed=passed,
            output=output,
            error=error,
            execution_time_ms=exec_ms
        )




@router.get("/submissions/{submission_id}", response_model=SubmissionDetail)
def get_submission_status(submission_id: str):
    """
    Polls the current status of a code submission.
    Called by Frontend (Developer 1) every 2 seconds until status is 'completed' or 'error'.
    """
    try:
        res = supabase.table("submissions").select("*").eq("id", submission_id).execute()

        if not res.data or len(res.data) == 0:
            raise HTTPException(status_code=404, detail="Submission not found")

        item = res.data[0]
        return SubmissionDetail(
            id=item["id"],
            user_id=item["user_id"],
            lesson_id=item["lesson_id"],
            submitted_code=item["submitted_code"],
            language=item["language"],
            status=item["status"],
            passed=item.get("passed"),
            output=item.get("output"),
            error=item.get("error"),
            execution_time_ms=item.get("execution_time_ms"),
            created_at=str(item.get("created_at", ""))
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching submission: {str(e)}")


@router.get("/lessons", response_model=List[UnitResponse])
def list_all_lessons():
    """
    Fetches the entire curriculum tree (Units -> Modules -> Lessons) for the Student Dashboard map.
    """
    try:
        units_res = supabase.table("units").select("*").order("order_index").execute()
        modules_res = supabase.table("modules").select("*").order("order_index").execute()
        lessons_res = supabase.table("lessons").select("*").order("order_index").execute()

        units_data = units_res.data or []
        modules_data = modules_res.data or []
        lessons_data = lessons_res.data or []

        # Map lessons by module_id
        lessons_by_module = {}
        for l in lessons_data:
            mod_id = l["module_id"]
            if mod_id not in lessons_by_module:
                lessons_by_module[mod_id] = []
            lessons_by_module[mod_id].append(
                LessonResponse(
                    id=l["id"],
                    module_id=l["module_id"],
                    title=l["title"],
                    lesson_type=l.get("lesson_type", "code_fix"),
                    content_blocks=l.get("content_blocks", []),
                    exercise_data=l.get("exercise_data", {}),
                    xp_reward=l.get("xp_reward", 15),
                    order_index=l.get("order_index", 0),
                    created_at=str(l.get("created_at", ""))
                )
            )

        # Sort lessons within each module
        for mod_id in lessons_by_module:
            lessons_by_module[mod_id].sort(key=lambda l: l.order_index)

        # Map modules by unit_id
        modules_by_unit = {}
        for m in modules_data:
            u_id = m["unit_id"]
            if u_id not in modules_by_unit:
                modules_by_unit[u_id] = []
            mod_id = m["id"]
            modules_by_unit[u_id].append(
                ModuleResponse(
                    id=mod_id,
                    unit_id=u_id,
                    title=m["title"],
                    order_index=m.get("order_index", 0),
                    lessons=lessons_by_module.get(mod_id, [])
                )
            )

        # Sort modules within each unit
        for u_id in modules_by_unit:
            modules_by_unit[u_id].sort(key=lambda m: m.order_index)

        # Assemble Units
        result = []
        for u in units_data:
            u_id = u["id"]
            result.append(
                UnitResponse(
                    id=u_id,
                    title=u["title"],
                    order_index=u.get("order_index", 0),
                    modules=modules_by_unit.get(u_id, [])
                )
            )

        # Sort units by order_index
        result.sort(key=lambda u: u.order_index)

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching lessons tree: {str(e)}")


@router.get("/lessons/{lesson_id}", response_model=LessonResponse)
def get_lesson_detail(lesson_id: str):
    """
    Fetches specific details for a single lesson by UUID or numeric index (1..26).
    """
    try:
        if lesson_id.isdigit():
            idx = int(lesson_id)
            modules_res = supabase.table("modules").select("id, unit_id, order_index").order("order_index").execute()
            units_res = supabase.table("units").select("id, order_index").order("order_index").execute()
            lessons_res = supabase.table("lessons").select("*").order("order_index").execute()
            
            unit_order = {u["id"]: u.get("order_index", 0) for u in (units_res.data or [])}
            mod_map = {m["id"]: (unit_order.get(m["unit_id"], 0), m.get("order_index", 0)) for m in (modules_res.data or [])}
            
            all_l = lessons_res.data or []
            all_l.sort(key=lambda x: (mod_map.get(x["module_id"], (0, 0)), x.get("order_index", 0)))
            if 1 <= idx <= len(all_l):
                l = all_l[idx - 1]
            else:
                raise HTTPException(status_code=404, detail="Lesson index out of range")
        else:
            res = supabase.table("lessons").select("*").eq("id", lesson_id).execute()
            if not res.data or len(res.data) == 0:
                raise HTTPException(status_code=404, detail="Lesson not found")
            l = res.data[0]
        return LessonResponse(
            id=l["id"],
            module_id=l["module_id"],
            title=l["title"],
            lesson_type=l.get("lesson_type", "code_fix"),
            content_blocks=l.get("content_blocks", []),
            exercise_data=l.get("exercise_data", {}),
            xp_reward=l.get("xp_reward", 15),
            order_index=l.get("order_index", 0),
            created_at=str(l.get("created_at", ""))
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching lesson: {str(e)}")


@router.get("/users/{user_id}/progress", response_model=UserProgressResponse)
def get_user_progress(user_id: str):
    """
    Fetches the student's current XP and Hearts for Gamification logic.
    """
    try:
        res = supabase.table("users").select("id, name, role, xp, hearts, gems, last_heart_update").eq("id", user_id).execute()
        if not res.data or len(res.data) == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        u = res.data[0]
        hearts = u.get("hearts", 5)
        gems = u.get("gems", 500)
        last_update_str = u.get("last_heart_update")
        
        # Passive auto-regeneration (1 heart every 4 hours)
        REGEN_HOURS = 4
        if hearts < 5 and last_update_str:
            try:
                # Handle ISO 8601 strings from postgres
                last_update = datetime.fromisoformat(last_update_str.replace("Z", "+00:00"))
                now = datetime.now(timezone.utc)
                hours_passed = (now - last_update).total_seconds() / 3600
                
                hearts_to_add = int(hours_passed // REGEN_HOURS)
                if hearts_to_add > 0:
                    new_hearts = min(5, hearts + hearts_to_add)
                    # If we haven't reached 5 yet, advance the timestamp by the number of hearts generated.
                    # If we reached 5, timestamp doesn't matter until they lose a heart again.
                    if new_hearts < 5:
                        new_last_update = last_update + timedelta(hours=hearts_to_add * REGEN_HOURS)
                        new_last_update_str = new_last_update.isoformat()
                    else:
                        new_last_update_str = now.isoformat()
                        
                    # Update DB
                    update_res = supabase.table("users").update({
                        "hearts": new_hearts, 
                        "last_heart_update": new_last_update_str
                    }).eq("id", user_id).execute()
                    
                    if update_res.data:
                        u = update_res.data[0]
                        hearts = new_hearts
                        last_update_str = new_last_update_str
            except Exception as ex:
                print(f"Error processing heart regen: {ex}")

        # Query completed lessons where passed == True
        completed_lessons = []
        try:
            subs_res = supabase.table("submissions").select("lesson_id").eq("user_id", user_id).eq("passed", True).execute()
            if subs_res.data:
                completed_lessons = list(set([s["lesson_id"] for s in subs_res.data if s.get("lesson_id")]))
        except Exception as e_subs:
            print(f"Error fetching completed lessons: {e_subs}")

        return UserProgressResponse(
            id=u["id"],
            name=u["name"],
            role=u["role"],
            xp=u.get("xp", 0),
            hearts=hearts,
            gems=gems,
            last_heart_update=last_update_str or "",
            completed_lessons=completed_lessons
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user progress: {str(e)}")


@router.post("/users/{user_id}/progress/update", response_model=UserProgressResponse)
def update_user_progress(user_id: str, payload: ProgressUpdateRequest):
    """
    Updates the student's XP and Hearts directly for non-code exercises (e.g. multiple choice, fill in the blanks).
    """
    try:
        # Fetch lesson to get XP reward
        lesson_res = supabase.table("lessons").select("xp_reward, lesson_type").eq("id", payload.lesson_id).execute()
        if not lesson_res.data or len(lesson_res.data) == 0:
            raise HTTPException(status_code=404, detail="Lesson not found")
            
        lesson = lesson_res.data[0]
        if lesson.get("lesson_type") == "code_fix":
            raise HTTPException(status_code=400, detail="Use code submission for code_fix lessons")
            
        xp_reward = lesson.get("xp_reward", 15)

        # Fetch current user
        user_res = supabase.table("users").select("id, name, role, xp, hearts").eq("id", user_id).execute()
        if not user_res.data or len(user_res.data) == 0:
            raise HTTPException(status_code=404, detail="User not found")
            
        user = user_res.data[0]
        new_xp = user.get("xp", 0)
        new_hearts = user.get("hearts", 5)
        old_hearts = new_hearts
        updates = {}

        if payload.passed:
            if payload.is_practice:
                new_xp += 5
            else:
                new_xp += xp_reward
            try:
                supabase.table("submissions").insert({
                    "user_id": user_id,
                    "lesson_id": payload.lesson_id,
                    "passed": True,
                    "status": "completed"
                }).execute()
            except Exception as e_sub_ins:
                print(f"Error recording submission: {e_sub_ins}")
        else:
            if not payload.is_practice:
                new_hearts = max(0, new_hearts - 1)

        updates["xp"] = new_xp
        updates["hearts"] = new_hearts
        
        # If dropping from 5 to 4 hearts, start the regen timer
        if old_hearts == 5 and new_hearts < 5:
            updates["last_heart_update"] = datetime.now(timezone.utc).isoformat()

        # Update user
        update_res = supabase.table("users").update(updates).eq("id", user_id).execute()
        if not update_res.data or len(update_res.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to update progress")

        # Query completed lessons
        completed_lessons = []
        try:
            subs_res = supabase.table("submissions").select("lesson_id").eq("user_id", user_id).eq("passed", True).execute()
            if subs_res.data:
                completed_lessons = list(set([s["lesson_id"] for s in subs_res.data if s.get("lesson_id")]))
        except Exception as e_subs:
            print(f"Error fetching completed lessons: {e_subs}")

        u = update_res.data[0]
        return UserProgressResponse(
            id=u["id"],
            name=u["name"],
            role=u["role"],
            xp=u.get("xp", 0),
            hearts=u.get("hearts", 5),
            gems=u.get("gems", 500),
            last_heart_update=u.get("last_heart_update", ""),
            completed_lessons=completed_lessons
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating user progress: {str(e)}")

@router.post("/users/{user_id}/shop/refill-hearts", response_model=UserProgressResponse)
def refill_hearts(user_id: str):
    """
    Shop API: Refill hearts to 5 for 350 gems.
    """
    try:
        user_res = supabase.table("users").select("id, name, role, xp, hearts, gems, last_heart_update").eq("id", user_id).execute()
        if not user_res.data or len(user_res.data) == 0:
            raise HTTPException(status_code=404, detail="User not found")
            
        u = user_res.data[0]
        hearts = u.get("hearts", 5)
        gems = u.get("gems", 500)
        
        if hearts >= 5:
            raise HTTPException(status_code=400, detail="Hearts are already full")
            
        if gems < 350:
            raise HTTPException(status_code=400, detail="Not enough gems")
            
        updates = {
            "hearts": 5,
            "gems": gems - 350,
            "last_heart_update": datetime.now(timezone.utc).isoformat()
        }
        
        update_res = supabase.table("users").update(updates).eq("id", user_id).execute()
        if not update_res.data:
            raise HTTPException(status_code=500, detail="Failed to refill hearts")
            
        updated_user = update_res.data[0]
        return UserProgressResponse(
            id=updated_user["id"],
            name=updated_user["name"],
            role=updated_user["role"],
            xp=updated_user.get("xp", 0),
            hearts=updated_user.get("hearts", 5),
            gems=updated_user.get("gems", 500),
            last_heart_update=updated_user.get("last_heart_update", "")
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error refilling hearts: {str(e)}")

@router.get("/leaderboard", response_model=List[LeaderboardEntry])
def get_leaderboard(limit: int = 10):
    """
    Fetches the top students ordered by XP for the Leaderboard.
    """
    try:
        res = supabase.table("users").select("id, name, xp").eq("role", "student").order("xp", desc=True).limit(limit).execute()
        
        result = []
        for index, u in enumerate(res.data or []):
            result.append(
                LeaderboardEntry(
                    id=u["id"],
                    name=u["name"],
                    xp=u.get("xp", 0),
                    rank=index + 1
                )
            )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching leaderboard: {str(e)}")


@router.post("/users/{user_id}/rewards/claim", response_model=UserProgressResponse)
def claim_quest_reward(user_id: str, payload: dict):
    """
    Awards Gems and XP to the student upon completing quests or challenges.
    """
    try:
        reward_gems = payload.get("gems", 0)
        reward_xp = payload.get("xp", 0)

        user_res = supabase.table("users").select("id, name, role, xp, hearts, gems, last_heart_update").eq("id", user_id).execute()
        if not user_res.data:
            raise HTTPException(status_code=404, detail="User not found")

        u = user_res.data[0]
        new_xp = u.get("xp", 0) + reward_xp
        new_gems = u.get("gems", 500) + reward_gems

        update_res = supabase.table("users").update({
            "xp": new_xp,
            "gems": new_gems
        }).eq("id", user_id).execute()

        if not update_res.data:
            raise HTTPException(status_code=500, detail="Failed to claim reward")

        updated = update_res.data[0]
        return UserProgressResponse(
            id=updated["id"],
            name=updated["name"],
            role=updated["role"],
            xp=updated.get("xp", 0),
            hearts=updated.get("hearts", 5),
            gems=updated.get("gems", 500),
            last_heart_update=updated.get("last_heart_update", "")
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error claiming reward: {str(e)}")



