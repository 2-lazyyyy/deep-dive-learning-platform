from typing import List
from fastapi import APIRouter, HTTPException, status
from database import supabase
from models import (
    SubmissionCreate,
    SubmissionCreateResponse,
    SubmissionDetail,
    LessonResponse,
    UnitResponse,
    ModuleResponse
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
        queue_submission(submission_id=sub_id, code=payload.code, language=payload.language)

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
                    theory_content=l.get("theory_content"),
                    starter_code=l.get("starter_code", ""),
                    expected_output=l.get("expected_output", ""),
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
            theory_content=l.get("theory_content"),
            starter_code=l.get("starter_code", ""),
            expected_output=l.get("expected_output", ""),
            xp_reward=l.get("xp_reward", 15),
            order_index=l.get("order_index", 0),
            created_at=str(l.get("created_at", ""))
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching lesson: {str(e)}")
