import pytest
import sys
import os

# Add parent directory to sys.path so we can import backend modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from routers.ai import is_myanmar_text, analyze_python_code, generate_heuristic_tutor_response
from models import AIChatRequest, UnitCreate, ModuleCreate, LessonCreate

class TestUnitAIEngine:
    def test_myanmar_language_detection(self):
        assert is_myanmar_text("ဒီ code မှာ ဘာမှားနေလဲ?") == True
        assert is_myanmar_text("မင်္ဂလာပါ") == True
        assert is_myanmar_text("Hello, what is the error here?") == False
        assert is_myanmar_text("print('hello world')") == False

    def test_ast_syntax_error_detection(self):
        # Missing closing parenthesis
        code_with_syntax_err = 'print("Hello World"'
        res = analyze_python_code(code_with_syntax_err)
        assert res["has_issues"] == True
        assert any(i["type"] == "syntax_error" for i in res["issues"])

    def test_ast_python2_print_detection(self):
        code_py2 = 'print "Hello"'
        res = analyze_python_code(code_py2)
        assert res["has_issues"] == True
        assert any(i["type"] in ["syntax_error", "python2_print"] for i in res["issues"])

    def test_ast_valid_code(self):
        valid_code = 'x = 10\ny = 20\nprint(x + y)'
        res = analyze_python_code(valid_code)
        assert res["has_issues"] == False

    def test_ai_tutor_burmese_response(self):
        payload = AIChatRequest(
            message="ဒီ code မှာ print က ဘာလို့ error တက်တာလဲ?",
            student_code='print "Hello"',
            error_message="SyntaxError: invalid syntax"
        )
        response = generate_heuristic_tutor_response(payload)
        assert "SyntaxError" in response
        assert is_myanmar_text(response) == True

    def test_ai_tutor_english_response(self):
        payload = AIChatRequest(
            message="What is the error in my code?",
            student_code='print "Hello"',
            error_message="SyntaxError: invalid syntax"
        )
        response = generate_heuristic_tutor_response(payload)
        assert "SyntaxError" in response
        assert is_myanmar_text(response) == False

class TestUnitPydanticModels:
    def test_unit_create_validation(self):
        unit = UnitCreate(title="Introduction to Python", order_index=1)
        assert unit.title == "Introduction to Python"
        assert unit.order_index == 1

    def test_module_create_validation(self):
        mod = ModuleCreate(unit_id="u123", title="Variables and Data Types", order_index=1)
        assert mod.unit_id == "u123"
        assert mod.title == "Variables and Data Types"

    def test_lesson_create_validation(self):
        lesson = LessonCreate(
            module_id="m123",
            title="Hello World Exercise",
            lesson_type="multiple_choice",
            content_blocks=[{"type": "text", "content": "Welcome"}],
            exercise_data={"question": "What is Python?", "options": ["A snake", "A language"], "correctIndex": 1},
            xp_reward=20,
            order_index=1
        )
        assert lesson.title == "Hello World Exercise"
        assert lesson.lesson_type == "multiple_choice"
        assert lesson.xp_reward == 20
