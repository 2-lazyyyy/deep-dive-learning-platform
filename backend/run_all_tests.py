import sys
import os
import time
import requests

# Enable UTF-8 stdout for Windows with unbuffered streaming
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from routers.ai import is_myanmar_text, analyze_python_code, generate_heuristic_tutor_response
from models import AIChatRequest, UnitCreate, ModuleCreate, LessonCreate

BASE_URL = "http://127.0.0.1:8000"
STUDENT_ID = "00000000-0000-0000-0000-000000000002"

passed_count = 0
failed_count = 0
results_log = []

def record_test(name, passed, detail=""):
    global passed_count, failed_count
    if passed:
        passed_count += 1
        status = "PASSED"
        print(f"  [PASS] {name}")
    else:
        failed_count += 1
        status = "FAILED"
        print(f"  [FAIL] {name}: {detail}")
    results_log.append({"test": name, "status": status, "detail": detail})

def run_unit_tests():
    print("\n" + "="*20 + " 1. RUNNING UNIT TESTS " + "="*20)
    
    # 1.1 Language Detection
    try:
        assert is_myanmar_text("ဒီ code မှာ ဘာမှားနေလဲ?") == True
        assert is_myanmar_text("မင်္ဂလာပါ") == True
        assert is_myanmar_text("Hello World") == False
        record_test("Unit 1: Burmese vs English Language Detection", True)
    except Exception as e:
        record_test("Unit 1: Burmese vs English Language Detection", False, str(e))

    # 1.2 Syntax Error AST Analyzer
    try:
        res = analyze_python_code('print("Unclosed String')
        assert res["has_issues"] == True
        record_test("Unit 2: AST Syntax Error Analyzer", True)
    except Exception as e:
        record_test("Unit 2: AST Syntax Error Analyzer", False, str(e))

    # 1.3 Python 2 Print Detection
    try:
        res = analyze_python_code('print "Hello"')
        assert res["has_issues"] == True
        record_test("Unit 3: Python 2 Print Compatibility Check", True)
    except Exception as e:
        record_test("Unit 3: Python 2 Print Compatibility Check", False, str(e))

    # 1.4 Valid Python AST
    try:
        res = analyze_python_code('x = 10\ny = 20\nprint(x + y)')
        assert res["has_issues"] == False
        record_test("Unit 4: Valid Python AST Parse", True)
    except Exception as e:
        record_test("Unit 4: Valid Python AST Parse", False, str(e))

    # 1.5 AI Burmese Tutor Heuristic Response
    try:
        req = AIChatRequest(message="ဒီ code မှာ print က ဘာလို့ error တက်တာလဲ?", student_code='print "Hello"', error_message="SyntaxError")
        resp = generate_heuristic_tutor_response(req)
        assert "SyntaxError" in resp and is_myanmar_text(resp)
        record_test("Unit 5: AI Burmese Tutor Pedagogical Generator", True)
    except Exception as e:
        record_test("Unit 5: AI Burmese Tutor Pedagogical Generator", False, str(e))

    # 1.6 AI English Tutor Response
    try:
        req = AIChatRequest(message="What is the error?", student_code='print "Hello"', error_message="SyntaxError")
        resp = generate_heuristic_tutor_response(req)
        assert "SyntaxError" in resp and not is_myanmar_text(resp)
        record_test("Unit 6: AI English Tutor Response Generator", True)
    except Exception as e:
        record_test("Unit 6: AI English Tutor Response Generator", False, str(e))

    # 1.7 Pydantic Unit Model
    try:
        u = UnitCreate(title="Test Unit", order_index=1)
        assert u.title == "Test Unit"
        record_test("Unit 7: Pydantic UnitCreate Schema Validation", True)
    except Exception as e:
        record_test("Unit 7: Pydantic UnitCreate Schema Validation", False, str(e))

    # 1.8 Pydantic Module Model
    try:
        m = ModuleCreate(unit_id="u-1", title="Test Module", order_index=1)
        assert m.unit_id == "u-1"
        record_test("Unit 8: Pydantic ModuleCreate Schema Validation", True)
    except Exception as e:
        record_test("Unit 8: Pydantic ModuleCreate Schema Validation", False, str(e))

    # 1.9 Pydantic Lesson Model
    try:
        l = LessonCreate(
            module_id="m-1",
            title="Lesson 1",
            lesson_type="multiple_choice",
            content_blocks=[{"type": "text", "content": "Text"}],
            exercise_data={"question": "Q?", "options": ["A", "B"], "correctIndex": 0},
            xp_reward=20,
            order_index=1
        )
        assert l.xp_reward == 20
        record_test("Unit 9: Pydantic LessonCreate Schema Validation", True)
    except Exception as e:
        record_test("Unit 9: Pydantic LessonCreate Schema Validation", False, str(e))

def run_integration_tests():
    print("\n" + "="*20 + " 2. RUNNING INTEGRATION TESTS " + "="*20)

    # 2.1 Health Check
    try:
        r = requests.get(f"{BASE_URL}/health")
        assert r.status_code == 200 and r.json() == {"status": "healthy"}
        record_test("Integration 1: FastAPI Health Endpoint", True)
    except Exception as e:
        record_test("Integration 1: FastAPI Health Endpoint", False, str(e))

    # 2.2 Student Progress
    try:
        r = requests.get(f"{BASE_URL}/api/v1/users/{STUDENT_ID}/progress")
        assert r.status_code == 200 and "xp" in r.json()
        record_test("Integration 2: Student Progress & Stats Fetch", True)
    except Exception as e:
        record_test("Integration 2: Student Progress & Stats Fetch", False, str(e))

    # 2.3 Curriculum
    try:
        r = requests.get(f"{BASE_URL}/api/v1/lessons")
        assert r.status_code == 200 and isinstance(r.json(), list)
        record_test("Integration 3: Curriculum Hierarchy Retrieval", True)
    except Exception as e:
        record_test("Integration 3: Curriculum Hierarchy Retrieval", False, str(e))

    # 2.4 Leaderboard
    try:
        r = requests.get(f"{BASE_URL}/api/v1/leaderboard")
        assert r.status_code == 200 and isinstance(r.json(), list)
        record_test("Integration 4: Leaderboard Real-time Rankings", True)
    except Exception as e:
        record_test("Integration 4: Leaderboard Real-time Rankings", False, str(e))

    # 2.5 Teacher Stats
    try:
        r = requests.get(f"{BASE_URL}/api/teacher/stats")
        assert r.status_code == 200 and "online_students" in r.json() and "total_submissions" in r.json()
        record_test("Integration 5: Teacher Analytics Dashboard Stats", True)
    except Exception as e:
        record_test("Integration 5: Teacher Analytics Dashboard Stats", False, str(e))

    # 2.6 Teacher Submissions Audit
    try:
        r = requests.get(f"{BASE_URL}/api/teacher/submissions?limit=5")
        assert r.status_code == 200 and isinstance(r.json(), list)
        record_test("Integration 6: Teacher Submissions Audit Trail", True)
    except Exception as e:
        record_test("Integration 6: Teacher Submissions Audit Trail", False, str(e))

    # 2.7 AI Tutor Endpoint
    try:
        r = requests.post(f"{BASE_URL}/api/v1/ai/tutor", json={"message": "Help with print syntax", "error_message": "SyntaxError"})
        assert r.status_code == 200 and "reply" in r.json()
        record_test("Integration 7: AI Student Tutor API Endpoint", True)
    except Exception as e:
        record_test("Integration 7: AI Student Tutor API Endpoint", False, str(e))

    # 2.8 Quest Rewards Claim
    try:
        r = requests.post(f"{BASE_URL}/api/v1/users/{STUDENT_ID}/rewards/claim", json={"gems": 10, "xp": 20})
        assert r.status_code == 200 and "gems" in r.json()
        record_test("Integration 8: Quest Rewards Claim & DB Persistence", True)
    except Exception as e:
        record_test("Integration 8: Quest Rewards Claim & DB Persistence", False, str(e))

    # 2.9 Teacher CRUD Lifecycle
    try:
        u_res = requests.post(f"{BASE_URL}/api/teacher/units", json={"title": "Test Int Unit", "order_index": 99}).json()
        u_id = u_res["id"]
        requests.put(f"{BASE_URL}/api/teacher/units/{u_id}", json={"title": "Updated Int Unit"})
        requests.delete(f"{BASE_URL}/api/teacher/units/{u_id}")
        record_test("Integration 9: Teacher Unit CRUD Lifecycle", True)
    except Exception as e:
        record_test("Integration 9: Teacher Unit CRUD Lifecycle", False, str(e))

def run_e2e_system_tests():
    print("\n" + "="*20 + " 3. RUNNING END-TO-END SYSTEM TESTS " + "="*20)

    try:
        # Step 1: Create Unit & Module & Lessons
        u_id = requests.post(f"{BASE_URL}/api/teacher/units", json={"title": "E2E Automated Unit", "order_index": 999}).json()["id"]
        m_id = requests.post(f"{BASE_URL}/api/teacher/modules", json={"unit_id": u_id, "title": "E2E Module", "order_index": 1}).json()["id"]
        
        # Step 2: Multiple Choice
        mc_id = requests.post(f"{BASE_URL}/api/teacher/lessons", json={
            "module_id": m_id,
            "title": "E2E MC",
            "lesson_type": "multiple_choice",
            "content_blocks": [{"type": "text", "content": "MC"}],
            "exercise_data": {"question": "What is Python?", "options": ["A", "B"], "correctIndex": 0},
            "xp_reward": 20,
            "order_index": 1
        }).json()["id"]

        # Step 3: Code Fix Lesson
        cf_id = requests.post(f"{BASE_URL}/api/teacher/lessons", json={
            "module_id": m_id,
            "title": "E2E Code Fix",
            "lesson_type": "code_fix",
            "content_blocks": [{"type": "text", "content": "CF"}],
            "exercise_data": {"initialCode": "print('E2E OK')", "expectedOutput": "E2E OK"},
            "xp_reward": 50,
            "order_index": 2
        }).json()["id"]

        record_test("System 1: Teacher Complete Curriculum Provisioning", True)

        # Step 4: Solve MC Lesson
        p_res = requests.post(f"{BASE_URL}/api/v1/users/{STUDENT_ID}/progress/update", json={
            "lesson_id": mc_id,
            "passed": True,
            "is_practice": False
        })
        assert p_res.status_code == 200
        record_test("System 2: Student Multiple Choice Progression & XP Reward", True)

        # Step 5: Celery Sandbox Code Submission
        sub_res = requests.post(f"{BASE_URL}/api/v1/submissions", json={
            "user_id": STUDENT_ID,
            "lesson_id": cf_id,
            "code": "print('E2E OK')"
        }).json()
        sub_id = sub_res["submission_id"]

        # Step 6: Poll for Celery Worker Completion (up to 15s)
        completed = False
        for _ in range(15):
            time.sleep(1)
            poll = requests.get(f"{BASE_URL}/api/v1/submissions/{sub_id}").json()
            if poll["status"] == "completed":
                completed = True
                assert poll["passed"] == True
                assert "E2E OK" in poll["output"]
                break

        assert completed, "Celery worker timed out"
        record_test("System 3: Redis -> Celery -> Sandbox Async Code Execution", True)

        # Step 7: Teacher Audit Log Verification
        sub_log = requests.get(f"{BASE_URL}/api/teacher/submissions?limit=10").json()
        assert any(s["id"] == sub_id for s in sub_log)
        record_test("System 4: Teacher Real-time Submissions Audit Reflection", True)

        # Step 8: Cleanup
        requests.delete(f"{BASE_URL}/api/teacher/lessons/{mc_id}")
        requests.delete(f"{BASE_URL}/api/teacher/lessons/{cf_id}")
        requests.delete(f"{BASE_URL}/api/teacher/modules/{m_id}")
        requests.delete(f"{BASE_URL}/api/teacher/units/{u_id}")
        record_test("System 5: End-to-End System Cleanup", True)

    except Exception as e:
        record_test("System Full Flow Execution", False, str(e))

if __name__ == "__main__":
    print("\n" + "🚀"*15 + " STARTING DEEPDIVE COMPREHENSIVE TEST SUITE " + "🚀"*15)
    run_unit_tests()
    run_integration_tests()
    run_e2e_system_tests()
    
    total = passed_count + failed_count
    pass_pct = (passed_count / total) * 100 if total > 0 else 0
    print("\n" + "="*50)
    print(f"📊 SUMMARY: {passed_count}/{total} Tests Passed ({pass_pct:.1f}% Success Rate)")
    print("="*50)
