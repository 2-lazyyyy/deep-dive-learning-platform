import time
import requests

API_URL = "http://localhost:8000/api/v1"
USER_ID = "00000000-0000-0000-0000-000000000002" # Demo Student
LESSON_ID = "30000000-0000-0000-0000-000000000001" # Unit 1 Lesson 1

def print_step(msg):
    print(f"\n[{time.strftime('%H:%M:%S')}] 🚀 {msg}")

def test_system():
    print("=========================================")
    print("🕵️  DEEPDIVE LEARN - SYSTEM DEEP TEST  🕵️")
    print("=========================================")

    # 1. Fetch initial progress
    print_step("Fetching initial Gamification Progress...")
    try:
        resp = requests.get(f"{API_URL}/users/{USER_ID}/progress")
        if resp.status_code != 200:
            print(f"❌ Failed to fetch progress: {resp.text}")
            return
        initial_progress = resp.json()
        print(f"✅ Initial Progress: XP={initial_progress['xp']}, Hearts={initial_progress['hearts']}")
        initial_xp = initial_progress["xp"]
        initial_hearts = initial_progress["hearts"]
    except Exception as e:
        print(f"❌ API Connection Error. Is FastAPI running? {e}")
        return

    # 2. Submit Correct Code (Success Flow)
    print_step("Submitting Correct Code (Expected to pass)...")
    payload = {
        "user_id": USER_ID,
        "lesson_id": LESSON_ID,
        "code": "print('Hello Python!')",
        "language": "python"
    }
    resp = requests.post(f"{API_URL}/submissions", json=payload)
    if resp.status_code != 200:
        print(f"❌ Failed to submit code: {resp.text}")
        return
    sub_data = resp.json()
    submission_id = sub_data["submission_id"]
    print(f"✅ Submission created! ID: {submission_id}")

    # 3. Poll for result
    print_step("Polling for execution result...")
    success_passed = False
    for i in range(15):
        poll_resp = requests.get(f"{API_URL}/submissions/{submission_id}")
        poll_data = poll_resp.json()
        status = poll_data["status"]
        print(f"   Status: {status}...")
        if status in ["completed", "error"]:
            print(f"✅ Final Result: Passed={poll_data['passed']}")
            print(f"   Output: {poll_data['output']}")
            success_passed = poll_data["passed"]
            break
        time.sleep(1)

    if not success_passed:
        print("❌ Test Failed: Expected code to pass, but it failed.")
    
    # 4. Check XP increase
    print_step("Checking if XP increased...")
    resp = requests.get(f"{API_URL}/users/{USER_ID}/progress")
    new_progress = resp.json()
    print(f"✅ New Progress: XP={new_progress['xp']}, Hearts={new_progress['hearts']}")
    if new_progress["xp"] > initial_xp:
        print(f"🎉 SUCCESS: XP increased! {initial_xp} -> {new_progress['xp']}")
    else:
        print("❌ FAILURE: XP did not increase!")

    # 5. Submit Wrong Code (Error Flow)
    print_step("Submitting Wrong Code (Expected to fail)...")
    payload["code"] = "print('Wrong Answer')"
    resp = requests.post(f"{API_URL}/submissions", json=payload)
    sub_data = resp.json()
    submission_id = sub_data["submission_id"]
    print(f"✅ Submission created! ID: {submission_id}")

    # 6. Poll for result
    print_step("Polling for execution result...")
    error_passed = True
    for i in range(15):
        poll_resp = requests.get(f"{API_URL}/submissions/{submission_id}")
        poll_data = poll_resp.json()
        status = poll_data["status"]
        print(f"   Status: {status}...")
        if status in ["completed", "error"]:
            print(f"✅ Final Result: Passed={poll_data['passed']}")
            print(f"   Output: {poll_data['output']}")
            error_passed = poll_data["passed"]
            break
        time.sleep(1)
    
    if error_passed:
        print("❌ Test Failed: Expected code to fail, but it passed.")

    # 7. Check Heart deduction
    print_step("Checking if Hearts decreased...")
    resp = requests.get(f"{API_URL}/users/{USER_ID}/progress")
    final_progress = resp.json()
    print(f"✅ Final Progress: XP={final_progress['xp']}, Hearts={final_progress['hearts']}")
    if final_progress["hearts"] < new_progress["hearts"]:
        print(f"💔 SUCCESS: Hearts decreased! {new_progress['hearts']} -> {final_progress['hearts']}")
    else:
        print("❌ FAILURE: Hearts did not decrease!")
        
    print_step("✅ ALL DEEP TESTS COMPLETED!")

if __name__ == "__main__":
    test_system()
