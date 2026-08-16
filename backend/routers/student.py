from typing import List
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, HTTPException, status
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

router = APIRouter(prefix="/api/v1", tags=["Student"])

@router.post("/submissions", response_model=SubmissionCreateResponse, status_code=status.HTTP_201_CREATED)
def submit_code(payload: SubmissionCreate):
    """
    Submits student code for execution.
    1. Saves submission record in Supabase with status='queued'
    2. Enqueues task to Redis for Developer 3's Celery execution worker
    3. Returns submission ID for status polling
    """
    try:
        # Insert submission record into Supabase
        res = supabase.table("submissions").insert({
            "user_id": payload.user_id,
            "lesson_id": payload.lesson_id,
            "submitted_code": payload.code,
            "language": payload.language,
            "status": "queued"
        }).execute()

        if not res.data or len(res.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to create submission record in database.")

        sub_id = res.data[0]["id"]

        # Queue submission for execution worker
        queue_submission(submission_id=sub_id, code=payload.code, language=payload.language, is_practice=payload.is_practice)

        return SubmissionCreateResponse(submission_id=sub_id, status="queued")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing submission: {str(e)}")


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

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching lessons tree: {str(e)}")


@router.get("/lessons/{lesson_id}", response_model=LessonResponse)
def get_lesson_detail(lesson_id: str):
    """
    Fetches specific details for a single lesson.
    """
    try:
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

        return UserProgressResponse(
            id=u["id"],
            name=u["name"],
            role=u["role"],
            xp=u.get("xp", 0),
            hearts=hearts,
            gems=gems,
            last_heart_update=last_update_str or ""
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

        u = update_res.data[0]
        return UserProgressResponse(
            id=u["id"],
            name=u["name"],
            role=u["role"],
            xp=u.get("xp", 0),
            hearts=u.get("hearts", 5),
            gems=u.get("gems", 500),
            last_heart_update=u.get("last_heart_update", "")
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


