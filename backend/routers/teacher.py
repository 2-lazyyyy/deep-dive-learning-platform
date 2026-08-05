import random
import time
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from database import supabase
from models import (
    TeacherLoginRequest,
    TeacherLoginResponse,
    DashboardStatsResponse,
    LessonCreate,
    LessonUpdate,
    LessonResponse,
    SubmissionDetail
)
from worker import queue_submission

router = APIRouter(prefix="/api/teacher", tags=["Teacher"])

@router.post("/auth/login", response_model=TeacherLoginResponse)
def teacher_login(payload: TeacherLoginRequest):
    """
    Teacher login authentication for Phase 1 Demo.
    Verifies user role is 'teacher' in database.
    """
    try:
        res = supabase.table("users").select("*").eq("email", payload.email).eq("role", "teacher").execute()

        if res.data and len(res.data) > 0:
            user = res.data[0]
            return TeacherLoginResponse(
                success=True,
                user={"id": user["id"], "name": user["name"], "email": user["email"], "role": user["role"]},
                token="demo-teacher-session-token-12345",
                message="Login successful"
            )

        # Fallback for demo teacher
        if payload.email == "teacher@deepdive.edu":
            return TeacherLoginResponse(
                success=True,
                user={"id": "00000000-0000-0000-0000-000000000001", "name": "Demo Teacher", "email": payload.email, "role": "teacher"},
                token="demo-teacher-session-token-12345",
                message="Login successful"
            )

        raise HTTPException(status_code=401, detail="Invalid email or password for teacher role.")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login error: {str(e)}")


@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats():
    """
    Returns high-level statistics for the Teacher Dashboard overview cards.
    """
    try:
        # Total submissions
        sub_res = supabase.table("submissions").select("id, passed", count="exact").execute()
        total_subs = sub_res.count if sub_res.count is not None else len(sub_res.data or [])

        passed_count = sum(1 for s in (sub_res.data or []) if s.get("passed") is True)
        failed_count = sum(1 for s in (sub_res.data or []) if s.get("passed") is False)

        # Total lessons
        les_res = supabase.table("lessons").select("id", count="exact").execute()
        total_lessons = les_res.count if les_res.count is not None else len(les_res.data or [])

        # Active students count
        st_res = supabase.table("users").select("id", count="exact").eq("role", "student").execute()
        total_students = st_res.count if st_res.count is not None else len(st_res.data or [])

        return DashboardStatsResponse(
            online_students=max(1, total_students),
            total_submissions=total_subs,
            passed_submissions=passed_count,
            failed_submissions=failed_count,
            total_lessons=total_lessons
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating stats: {str(e)}")


@router.get("/submissions", response_model=List[SubmissionDetail])
def get_audit_trail(limit: int = 50):
    """
    Returns audit trail list of student submissions for Teacher Dashboard tables.
    """
    try:
        res = supabase.table("submissions").select("*").order("created_at", desc=True).limit(limit).execute()
        items = res.data or []
        
        result = []
        for item in items:
            result.append(
                SubmissionDetail(
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
            )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching audit trail: {str(e)}")


@router.post("/lessons", response_model=LessonResponse, status_code=status.HTTP_201_CREATED)
def create_lesson(payload: LessonCreate):
    """
    CRUD Endpoint: Create a new lesson from the Teacher Visual Syllabus Builder.
    """
    try:
        res = supabase.table("lessons").insert({
            "module_id": payload.module_id,
            "title": payload.title,
            "theory_content": payload.theory_content,
            "starter_code": payload.starter_code,
            "expected_output": payload.expected_output,
            "xp_reward": payload.xp_reward,
            "order_index": payload.order_index
        }).execute()

        if not res.data or len(res.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to create lesson in database.")

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
        raise HTTPException(status_code=500, detail=f"Error creating lesson: {str(e)}")


@router.put("/lessons/{lesson_id}", response_model=LessonResponse)
def update_lesson(lesson_id: str, payload: LessonUpdate):
    """
    CRUD Endpoint: Update an existing lesson.
    """
    try:
        update_data = {k: v for k, v in payload.dict().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields provided for update.")

        res = supabase.table("lessons").update(update_data).eq("id", lesson_id).execute()
        if not res.data or len(res.data) == 0:
            raise HTTPException(status_code=404, detail="Lesson not found or update failed.")

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
        raise HTTPException(status_code=500, detail=f"Error updating lesson: {str(e)}")


@router.delete("/lessons/{lesson_id}", status_code=status.HTTP_200_OK)
def delete_lesson(lesson_id: str):
    """
    CRUD Endpoint: Delete a lesson.
    """
    try:
        res = supabase.table("lessons").delete().eq("id", lesson_id).execute()
        return {"success": True, "message": f"Lesson {lesson_id} deleted."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting lesson: {str(e)}")


@router.post("/simulate")
def simulate_student_submissions():
    """
    Demo Simulator Endpoint: Triggers 5 sample student submissions to populate
    the Redis queue and test live polling on the Teacher Dashboard.
    """
    demo_user_id = "00000000-0000-0000-0000-000000000002"
    demo_lesson_id = "30000000-0000-0000-0000-000000000001"

    sample_codes = [
        "print('Hello, World!')",
        "print('Hello World')",
        "print('Testing submission 3')",
        "x = 10\ny = 20\nprint(x + y)",
        "print('Demo completed!')"
    ]

    created_submissions = []

    for code in sample_codes:
        res = supabase.table("submissions").insert({
            "user_id": demo_user_id,
            "lesson_id": demo_lesson_id,
            "submitted_code": code,
            "language": "python",
            "status": "queued"
        }).execute()

        if res.data and len(res.data) > 0:
            sub_id = res.data[0]["id"]
            queue_submission(submission_id=sub_id, code=code, language="python")
            created_submissions.append(sub_id)

    return {
        "status": "success",
        "message": f"Simulated {len(created_submissions)} submissions successfully.",
        "submission_ids": created_submissions
    }
