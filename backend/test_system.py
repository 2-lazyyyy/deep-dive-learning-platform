import requests
import time
import sys

BASE_URL = "http://localhost:8000"
STUDENT_ID = "00000000-0000-0000-0000-000000000002"

def print_step(step_name):
    print(f"\n[{'='*10} {step_name} {'='*10}]")

def test():
    # 1. Get Curriculum to find a Module ID
    print_step("1. Fetching Curriculum & Finding Module ID")
    res = requests.get(f"{BASE_URL}/api/v1/lessons")
    assert res.status_code == 200, "Failed to fetch curriculum"
    units = res.json()
    module_id = None
    for unit in units:
        if unit.get("modules"):
            module_id = unit["modules"][0]["id"]
            break
    
    assert module_id is not None, "No module found in the database. Please run migrations!"
    print(f"Found Module ID: {module_id}")

    # 2. Get Initial Student Progress
    print_step("2. Fetching Initial Student Progress")
    res = requests.get(f"{BASE_URL}/api/v1/users/{STUDENT_ID}/progress")
    assert res.status_code == 200, "Failed to fetch progress"
    initial_progress = res.json()
    print(f"Initial Progress: XP={initial_progress['xp']}, Hearts={initial_progress['hearts']}")

    # 3. Create a Multiple Choice Lesson
    print_step("3. Creating Multiple Choice Lesson")
    mc_payload = {
        "module_id": module_id,
        "title": "Deep Test: Multiple Choice",
        "lesson_type": "multiple_choice",
        "content_blocks": [{"type": "text", "content": "Test MC"}],
        "exercise_data": {
            "question": "What is 2 + 2?",
            "options": ["3", "4", "5"],
            "correctIndex": 1
        },
        "xp_reward": 20,
        "order_index": 99
    }
    res = requests.post(f"{BASE_URL}/api/teacher/lessons", json=mc_payload)
    assert res.status_code == 201, f"Failed to create MC lesson: {res.text}"
    mc_lesson_id = res.json()["id"]
    print(f"Created MC Lesson ID: {mc_lesson_id}")

    # 4. Create a Fill in the Blanks Lesson
    print_step("4. Creating Fill in the Blanks Lesson")
    fb_payload = {
        "module_id": module_id,
        "title": "Deep Test: Fill in the Blanks",
        "lesson_type": "fill_blanks",
        "content_blocks": [{"type": "text", "content": "Test FB"}],
        "exercise_data": {
            "codeTemplate": ["print('Hello')"],
            "correctTokens": ["print"],
            "tokenPool": ["print", "echo"]
        },
        "xp_reward": 15,
        "order_index": 100
    }
    res = requests.post(f"{BASE_URL}/api/teacher/lessons", json=fb_payload)
    assert res.status_code == 201, f"Failed to create FB lesson: {res.text}"
    fb_lesson_id = res.json()["id"]
    print(f"Created FB Lesson ID: {fb_lesson_id}")

    # 5. Create a Code Fix Lesson
    print_step("5. Creating Code Fix Lesson")
    cf_payload = {
        "module_id": module_id,
        "title": "Deep Test: Code Fix",
        "lesson_type": "code_fix",
        "content_blocks": [{"type": "text", "content": "Test CF"}],
        "exercise_data": {
            "initialCode": "print('Wrong')",
            "expectedOutput": "Right\n"
        },
        "xp_reward": 50,
        "order_index": 101
    }
    res = requests.post(f"{BASE_URL}/api/teacher/lessons", json=cf_payload)
    assert res.status_code == 201, f"Failed to create CF lesson: {res.text}"
    cf_lesson_id = res.json()["id"]
    print(f"Created CF Lesson ID: {cf_lesson_id}")

    # 6. Test Non-Code Exercise (Multiple Choice Success)
    print_step("6. Testing MC Success (API Progress Update)")
    cur_p = requests.get(f"{BASE_URL}/api/v1/users/{STUDENT_ID}/progress").json()
    res = requests.post(
        f"{BASE_URL}/api/v1/users/{STUDENT_ID}/progress/update",
        json={"lesson_id": mc_lesson_id, "passed": True}
    )
    assert res.status_code == 200, f"Failed progress update: {res.text}"
    prog = res.json()
    print(f"Progress after MC Success: XP={prog['xp']} (Expected: {cur_p['xp'] + 20})")
    assert prog['xp'] == cur_p['xp'] + 20

    # 7. Test Non-Code Exercise (Fill Blanks Failure)
    print_step("7. Testing FB Failure (API Progress Update)")
    res = requests.post(
        f"{BASE_URL}/api/v1/users/{STUDENT_ID}/progress/update",
        json={"lesson_id": fb_lesson_id, "passed": False}
    )
    assert res.status_code == 200, f"Failed progress update: {res.text}"
    prog = res.json()
    print(f"Progress after FB Failure: Hearts={prog['hearts']} (Expected: {max(0, cur_p['hearts'] - 1)})")
    assert prog['hearts'] == max(0, cur_p['hearts'] - 1)

    # 8. Test Code Execution (Code Fix Success)
    print_step("8. Testing CF Success (Celery execution)")
    code = "print('Right')"
    sub_res = requests.post(
        f"{BASE_URL}/api/v1/submissions",
        json={
            "user_id": STUDENT_ID,
            "lesson_id": cf_lesson_id,
            "code": code,
            "language": "python"
        }
    )
    assert sub_res.status_code == 201, f"Failed submission: {sub_res.text}"
    sub_id = sub_res.json()["submission_id"]
    print(f"Submitted code, tracking ID: {sub_id}")

    # Poll until done
    for _ in range(15):
        time.sleep(1)
        check_res = requests.get(f"{BASE_URL}/api/v1/submissions/{sub_id}")
        data = check_res.json()
        print(f"Status: {data['status']}")
        if data['status'] in ['completed', 'error']:
            break
    
    assert data['status'] == 'completed', "Execution failed or timed out"
    assert data['passed'] is True, f"Expected passed=True but got False. Output: {data.get('output')} Error: {data.get('error')}"

    # Verify XP updated by Celery
    res = requests.get(f"{BASE_URL}/api/v1/users/{STUDENT_ID}/progress")
    final_prog = res.json()
    print(f"Final Progress: XP={final_prog['xp']} (Expected: {prog['xp'] + 50})")
    assert final_prog['xp'] == prog['xp'] + 50, "XP was not added by Celery!"

    print_step("ALL DEEP TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    try:
        test()
    except Exception as e:
        print(f"TEST FAILED: {e}")
        sys.exit(1)
