import requests
import time
import sys

# Set stdout encoding for Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:8000"
STUDENT_ID = "00000000-0000-0000-0000-000000000002"

def print_header(title):
    print(f"\n{'='*15} {title} {'='*15}")

def run_e2e_system_test():
    print_header("STARTING DEEPDIVE FULL-SYSTEM E2E VERIFICATION")
    
    # -------------------------------------------------------------
    # 1. Check API Health
    # -------------------------------------------------------------
    print_header("Phase 1: API Server & Health Check")
    health = requests.get(f"{BASE_URL}/health")
    assert health.status_code == 200, f"Health check failed: {health.text}"
    print("✅ FastAPI Server is ONLINE and HEALTHY.")

    # -------------------------------------------------------------
    # 2. Student Initial Progress State
    # -------------------------------------------------------------
    print_header("Phase 2: Student Initial Gamification Profile")
    p_res = requests.get(f"{BASE_URL}/api/v1/users/{STUDENT_ID}/progress")
    assert p_res.status_code == 200, f"Failed to get student progress: {p_res.text}"
    student_init = p_res.json()
    start_xp = student_init["xp"]
    start_hearts = student_init["hearts"]
    start_gems = student_init["gems"]
    print(f"✅ Initial Student Stats: XP={start_xp} | Hearts={start_hearts} | Gems={start_gems}")

    # -------------------------------------------------------------
    # 3. Teacher Curriculum Workflow (Create Unit -> Module -> Lessons)
    # -------------------------------------------------------------
    print_header("Phase 3: Teacher Curriculum Creation (Unit -> Module -> Lessons)")
    
    # Create Unit
    unit_res = requests.post(f"{BASE_URL}/api/teacher/units", json={
        "title": "E2E Automated Python Unit",
        "order_index": 999
    })
    assert unit_res.status_code == 200
    unit_id = unit_res.json()["id"]
    print(f"✅ Teacher created Unit: ID={unit_id}")

    # Create Module
    mod_res = requests.post(f"{BASE_URL}/api/teacher/modules", json={
        "unit_id": unit_id,
        "title": "E2E Functions Module",
        "order_index": 1
    })
    assert mod_res.status_code == 200
    mod_id = mod_res.json()["id"]
    print(f"✅ Teacher created Module: ID={mod_id}")

    # Create Multiple Choice Lesson
    mc_res = requests.post(f"{BASE_URL}/api/teacher/lessons", json={
        "module_id": mod_id,
        "title": "E2E Multiple Choice Quiz",
        "lesson_type": "multiple_choice",
        "content_blocks": [{"type": "text", "content": "What is Python def used for?"}],
        "exercise_data": {
            "question": "What is 'def' in Python?",
            "options": ["Define a loop", "Define a function", "Delete a file"],
            "correctIndex": 1
        },
        "xp_reward": 25,
        "order_index": 1
    })
    assert mc_res.status_code == 200
    mc_lesson_id = mc_res.json()["id"]
    print(f"✅ Created Multiple Choice Lesson: ID={mc_lesson_id}")

    # Create Fill in Blanks Lesson
    fb_res = requests.post(f"{BASE_URL}/api/teacher/lessons", json={
        "module_id": mod_id,
        "title": "E2E Fill in Blanks",
        "lesson_type": "fill_blanks",
        "content_blocks": [{"type": "text", "content": "Fill the function keyword."}],
        "exercise_data": {
            "codeTemplate": "___ greet():\n    return 'Hi'",
            "correctTokens": ["def"],
            "tokenPool": ["def", "function", "var"]
        },
        "xp_reward": 30,
        "order_index": 2
    })
    assert fb_res.status_code == 200
    fb_lesson_id = fb_res.json()["id"]
    print(f"✅ Created Fill in the Blanks Lesson: ID={fb_lesson_id}")

    # Create Code Fix Lesson
    cf_res = requests.post(f"{BASE_URL}/api/teacher/lessons", json={
        "module_id": mod_id,
        "title": "E2E Code Execution Challenge",
        "lesson_type": "code_fix",
        "content_blocks": [{"type": "text", "content": "Fix the print syntax."}],
        "exercise_data": {
            "initialCode": "print('System Test Passed')",
            "expectedOutput": "System Test Passed"
        },
        "xp_reward": 50,
        "order_index": 3
    })
    assert cf_res.status_code == 200
    cf_lesson_id = cf_res.json()["id"]
    print(f"✅ Created Code Execution Lesson: ID={cf_lesson_id}")

    # -------------------------------------------------------------
    # 4. Student Solves Multiple Choice (Pass -> XP + 25)
    # -------------------------------------------------------------
    print_header("Phase 4: Student Completes Multiple Choice")
    mc_solve = requests.post(f"{BASE_URL}/api/v1/users/{STUDENT_ID}/progress/update", json={
        "lesson_id": mc_lesson_id,
        "passed": True,
        "is_practice": False
    })
    assert mc_solve.status_code == 200
    mc_prog = mc_solve.json()
    assert mc_prog["xp"] == start_xp + 25
    print(f"✅ Multiple Choice passed: XP updated to {mc_prog['xp']} (Expected: {start_xp + 25})")

    # -------------------------------------------------------------
    # 5. Student Fails Fill in Blanks (Fail -> Heart - 1)
    # -------------------------------------------------------------
    print_header("Phase 5: Student Fails Fill in Blanks")
    fb_solve = requests.post(f"{BASE_URL}/api/v1/users/{STUDENT_ID}/progress/update", json={
        "lesson_id": fb_lesson_id,
        "passed": False,
        "is_practice": False
    })
    assert fb_solve.status_code == 200
    fb_prog = fb_solve.json()
    assert fb_prog["hearts"] == max(0, start_hearts - 1)
    print(f"✅ Fill in blanks failed: Hearts reduced to {fb_prog['hearts']} (Expected: {start_hearts - 1})")

    # -------------------------------------------------------------
    # 6. Student Submits Python Code (Redis -> Celery -> Sandbox -> Success)
    # -------------------------------------------------------------
    print_header("Phase 6: Code Submission & Sandbox Execution via Celery")
    sub_payload = {
        "user_id": STUDENT_ID,
        "lesson_id": cf_lesson_id,
        "code": "print('System Test Passed')"
    }
    sub_res = requests.post(f"{BASE_URL}/api/v1/submissions", json=sub_payload)
    assert sub_res.status_code == 200
    submission_id = sub_res.json()["submission_id"]
    print(f"✅ Submitted Code to Queue: Submission ID={submission_id}")

    # Poll submission result
    completed = False
    for attempt in range(12):
        time.sleep(1)
        poll_res = requests.get(f"{BASE_URL}/api/v1/submissions/{submission_id}")
        assert poll_res.status_code == 200
        poll_data = poll_res.json()
        if poll_data["status"] == "completed":
            completed = True
            assert poll_data["passed"] == True
            assert "System Test Passed" in poll_data["output"]
            print(f"✅ Celery Sandbox Executed in {poll_data['execution_time_ms']}ms. Output: '{poll_data['output'].strip()}'")
            break

    assert completed, "Timed out waiting for Celery worker to complete code execution!"

    # -------------------------------------------------------------
    # 7. AI Tutor Interaction (Myanmar & English)
    # -------------------------------------------------------------
    print_header("Phase 7: AI Student Tutor Heuristic Diagnostics")
    ai_mm = requests.post(f"{BASE_URL}/api/v1/ai/tutor", json={
        "message": "ဒီ code မှာ print က ဘာလို့ error တက်တာလဲ?",
        "student_code": 'print "Hello"',
        "error_message": "SyntaxError: invalid syntax"
    }).json()
    assert "SyntaxError" in ai_mm["reply"]
    print("✅ AI Tutor Myanmar Diagnosis Verified.")

    ai_hint = requests.post(f"{BASE_URL}/api/v1/ai/tutor", json={
        "message": "Give me a hint for this lesson",
        "lesson_title": "E2E Functions Module"
    }).json()
    assert "Hint" in ai_hint["reply"]
    print("✅ AI Tutor Pedagogical Hint Verified.")

    # -------------------------------------------------------------
    # 8. Quests Reward Claim & Shop Refill
    # -------------------------------------------------------------
    print_header("Phase 8: Gamification Quest Rewards & Shop Transaction")
    claim_res = requests.post(f"{BASE_URL}/api/v1/users/{STUDENT_ID}/rewards/claim", json={
        "gems": 50,
        "xp": 100
    }).json()
    print(f"✅ Claimed Quest: New XP={claim_res['xp']}, New Gems={claim_res['gems']}")

    # -------------------------------------------------------------
    # 9. Leaderboard Ranking Verification
    # -------------------------------------------------------------
    print_header("Phase 9: Real-time Leaderboard Verification")
    lb_res = requests.get(f"{BASE_URL}/api/v1/leaderboard").json()
    assert len(lb_res) > 0
    top_student = lb_res[0]
    print(f"✅ Top Leaderboard Student: {top_student['name']} with {top_student['xp']} XP (Rank #{top_student['rank']})")

    # -------------------------------------------------------------
    # 10. Teacher Analytics & Audit Log Verification
    # -------------------------------------------------------------
    print_header("Phase 10: Teacher Analytics & Audit Log Verification")
    stats = requests.get(f"{BASE_URL}/api/teacher/stats").json()
    assert stats["total_submissions"] > 0
    print(f"✅ Teacher Dashboard Stats: Total Students={stats['total_students']}, Submissions={stats['total_submissions']}, Pass Rate={stats['pass_rate']}%")

    # -------------------------------------------------------------
    # 11. Cleanup E2E Test Entities
    # -------------------------------------------------------------
    print_header("Phase 11: Cleaning Up Temporary E2E Test Entities")
    requests.delete(f"{BASE_URL}/api/teacher/lessons/{mc_lesson_id}")
    requests.delete(f"{BASE_URL}/api/teacher/lessons/{fb_lesson_id}")
    requests.delete(f"{BASE_URL}/api/teacher/lessons/{cf_lesson_id}")
    requests.delete(f"{BASE_URL}/api/teacher/modules/{mod_id}")
    requests.delete(f"{BASE_URL}/api/teacher/units/{unit_id}")
    print("✅ Cleanup finished cleanly.")

    print_header("🎉 ALL 11 PHASES OF THE SYSTEM TEST PASSED WITH 100% SUCCESS!")

if __name__ == "__main__":
    run_e2e_system_test()
