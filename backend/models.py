from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime

# ============================================================
# SUBMISSION SCHEMAS
# ============================================================
class SubmissionCreate(BaseModel):
    user_id: str = Field(..., description="UUID of the user making the submission", example="00000000-0000-0000-0000-000000000002")
    lesson_id: str = Field(..., description="UUID of the lesson being submitted", example="30000000-0000-0000-0000-000000000001")
    code: str = Field(..., description="Source code to execute", example="print('Hello World')")
    language: str = Field(default="python", description="Programming language", example="python")
    is_practice: bool = Field(default=False, description="Flag indicating if the lesson is a practice retake")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "user_id": "00000000-0000-0000-0000-000000000002",
                    "lesson_id": "30000000-0000-0000-0000-000000000001",
                    "code": "print('Hello, World!')",
                    "language": "python"
                }
            ]
        }
    }

class SubmissionCreateResponse(BaseModel):
    submission_id: str
    status: str

class SubmissionDetail(BaseModel):
    id: str
    user_id: str
    lesson_id: str
    submitted_code: str
    language: str
    status: str
    passed: Optional[bool] = None
    output: Optional[str] = None
    error: Optional[str] = None
    execution_time_ms: Optional[int] = None
    created_at: str

# ============================================================
# SYLLABUS & LESSON SCHEMAS
# ============================================================
class LessonCreate(BaseModel):
    module_id: str
    title: str
    lesson_type: str = "code_fix"
    content_blocks: list = []
    exercise_data: dict = {}
    xp_reward: int = 15
    order_index: int = 0

class LessonUpdate(BaseModel):
    title: Optional[str] = None
    lesson_type: Optional[str] = None
    content_blocks: Optional[list] = None
    exercise_data: Optional[dict] = None
    xp_reward: Optional[int] = None
    order_index: Optional[int] = None

class LessonResponse(BaseModel):
    id: str
    module_id: str
    title: str
    lesson_type: str
    content_blocks: list
    exercise_data: dict
    xp_reward: int
    order_index: int
    created_at: Optional[str] = None

class ModuleResponse(BaseModel):
    id: str
    unit_id: str
    title: str
    order_index: int
    lessons: List[LessonResponse] = []

class UnitResponse(BaseModel):
    id: str
    title: str
    order_index: int
    modules: List[ModuleResponse] = []

# ============================================================
# TEACHER SCHEMAS
# ============================================================
class TeacherLoginRequest(BaseModel):
    email: str
    password: str

class TeacherLoginResponse(BaseModel):
    success: bool
    user: Optional[dict] = None
    token: Optional[str] = None
    message: str

class DashboardStatsResponse(BaseModel):
    online_students: int
    total_submissions: int
    passed_submissions: int
    failed_submissions: int
    total_lessons: int

# ============================================================
# GAMIFICATION SCHEMAS
# ============================================================
class UserProgressResponse(BaseModel):
    id: str
    name: str
    role: str
    xp: int
    hearts: int
    gems: int
    last_heart_update: str

class ProgressUpdateRequest(BaseModel):
    lesson_id: str
    passed: bool
    is_practice: bool = False

class LeaderboardEntry(BaseModel):
    id: str
    name: str
    xp: int
    rank: int
