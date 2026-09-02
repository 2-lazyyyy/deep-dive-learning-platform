import pytest
import requests
import json

BASE_URL = "http://localhost:8000"
STUDENT_ID = "00000000-0000-0000-0000-000000000002"

class TestIntegrationAPIs:
    def test_health_check(self):
        res = requests.get(f"{BASE_URL}/health")
        assert res.status_code == 200
        assert res.json() == {"status": "healthy"}

    def test_student_progress_fetch(self):
        res = requests.get(f"{BASE_URL}/api/v1/users/{STUDENT_ID}/progress")
        assert res.status_code == 200
        data = res.json()
        assert "xp" in data
        assert "hearts" in data
        assert "gems" in data

    def test_curriculum_fetch(self):
        res = requests.get(f"{BASE_URL}/api/v1/lessons")
        assert res.status_code == 200
        units = res.json()
        assert isinstance(units, list)
        assert len(units) > 0
        assert "modules" in units[0]

    def test_leaderboard_fetch(self):
        res = requests.get(f"{BASE_URL}/api/v1/leaderboard")
        assert res.status_code == 200
        leaderboard = res.json()
        assert isinstance(leaderboard, list)
        if len(leaderboard) > 0:
            assert "name" in leaderboard[0]
            assert "xp" in leaderboard[0]
            assert "rank" in leaderboard[0]

    def test_teacher_dashboard_stats(self):
        res = requests.get(f"{BASE_URL}/api/teacher/stats")
        assert res.status_code == 200
        stats = res.json()
        assert "total_students" in stats
        assert "total_submissions" in stats
        assert "pass_rate" in stats
        assert "active_lessons" in stats

    def test_teacher_submissions_audit_trail(self):
        res = requests.get(f"{BASE_URL}/api/teacher/submissions?limit=10")
        assert res.status_code == 200
        submissions = res.json()
        assert isinstance(submissions, list)

    def test_ai_student_tutor_burmese_query(self):
        payload = {
            "message": "ဒီ code မှာ print က ဘာလို့ error တက်တာလဲ?",
            "student_code": 'print "Test"',
            "error_message": "SyntaxError: invalid syntax"
        }
        res = requests.post(f"{BASE_URL}/api/v1/ai/tutor", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert "reply" in data
        assert "SyntaxError" in data["reply"]

    def test_ai_student_tutor_hint_query(self):
        payload = {
            "message": "ဒီ lesson အတွက် hint ပေးပါ",
            "lesson_title": "Variables in Python"
        }
        res = requests.post(f"{BASE_URL}/api/v1/ai/tutor", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert "reply" in data
        assert "Hint" in data["reply"]

    def test_quest_rewards_claim_persistence(self):
        # Fetch current progress
        res_before = requests.get(f"{BASE_URL}/api/v1/users/{STUDENT_ID}/progress").json()
        initial_xp = res_before["xp"]
        initial_gems = res_before["gems"]

        # Claim 15 Gems and 25 XP
        claim_payload = {"gems": 15, "xp": 25}
        res_claim = requests.post(f"{BASE_URL}/api/v1/users/{STUDENT_ID}/rewards/claim", json=claim_payload)
        assert res_claim.status_code == 200
        claimed_data = res_claim.json()
        assert claimed_data["xp"] == initial_xp + 25
        assert claimed_data["gems"] == initial_gems + 15

    def test_teacher_unit_and_module_crud_lifecycle(self):
        # 1. Create Unit
        unit_res = requests.post(f"{BASE_URL}/api/teacher/units", json={"title": "Test CRUD Unit", "order_index": 999})
        assert unit_res.status_code == 200
        created_unit = unit_res.json()
        unit_id = created_unit["id"]

        # 2. Update Unit
        update_res = requests.put(f"{BASE_URL}/api/teacher/units/{unit_id}", json={"title": "Updated Test CRUD Unit"})
        assert update_res.status_code == 200

        # 3. Create Module
        mod_res = requests.post(f"{BASE_URL}/api/teacher/modules", json={"unit_id": unit_id, "title": "Test CRUD Module", "order_index": 1})
        assert mod_res.status_code == 200
        created_mod = mod_res.json()
        mod_id = created_mod["id"]

        # 4. Create Lesson
        lesson_payload = {
            "module_id": mod_id,
            "title": "Test Integration Lesson",
            "lesson_type": "multiple_choice",
            "content_blocks": [{"type": "text", "content": "Integration Test"}],
            "exercise_data": {"question": "2 + 2 = ?", "options": ["3", "4"], "correctIndex": 1},
            "xp_reward": 15,
            "order_index": 1
        }
        lesson_res = requests.post(f"{BASE_URL}/api/teacher/lessons", json=lesson_payload)
        assert lesson_res.status_code == 200
        created_lesson = lesson_res.json()
        lesson_id = created_lesson["id"]

        # 5. Delete Lesson
        del_lesson = requests.delete(f"{BASE_URL}/api/teacher/lessons/{lesson_id}")
        assert del_lesson.status_code == 200

        # 6. Delete Module
        del_mod = requests.delete(f"{BASE_URL}/api/teacher/modules/{mod_id}")
        assert del_mod.status_code == 200

        # 7. Delete Unit
        del_unit = requests.delete(f"{BASE_URL}/api/teacher/units/{unit_id}")
        assert del_unit.status_code == 200
