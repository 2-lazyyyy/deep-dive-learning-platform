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
    theory_content: Optional[str] = ""
    starter_code: str = ""
    expected_output: str = ""
    xp_reward: int = 15
    order_index: int = 0

class LessonUpdate(BaseModel):
    title: Optional[str] = None
    theory_content: Optional[str] = None
    starter_code: Optional[str] = None
    expected_output: Optional[str] = None
    xp_reward: Optional[int] = None
    order_index: Optional[int] = None

class LessonResponse(BaseModel):
    id: str
    module_id: str
    title: str
    theory_content: Optional[str] = None
    starter_code: str
    expected_output: str
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
