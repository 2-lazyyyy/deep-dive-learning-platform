import os
import ast
import re
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, HTTPException, status
from models import AIChatRequest, AIChatResponse

router = APIRouter(prefix="/api/v1/ai", tags=["AI Student Tutor"])

def is_myanmar_text(text: str) -> bool:
    """Detects if text contains Myanmar Unicode characters."""
    return bool(re.search(r'[\u1000-\u109F]', text))

def analyze_python_code(code: str, error_msg: Optional[str] = None) -> Dict[str, Any]:
    """
    Performs static AST and syntax analysis to give targeted hints.
    """
    issues = []
    
    # 1. Syntax check
    try:
        ast.parse(code)
    except SyntaxError as e:
        issues.append({
            "type": "syntax_error",
            "line": e.lineno,
            "msg": e.msg,
            "text": e.text or ""
        })
    except Exception as e:
        issues.append({
            "type": "parse_error",
            "msg": str(e)
        })

    # 2. Common beginner pitfalls
    if "print " in code and "print(" not in code:
        issues.append({
            "type": "python2_print",
            "msg": "Python 3 requires parentheses for print function: print(...)"
        })

    if re.search(r'(if|elif|else|for|while|def|class)[^:]*$', code, re.MULTILINE):
        issues.append({
            "type": "missing_colon",
            "msg": "Remember to end your if/for/def block header with a colon (:)"
        })

    return {
        "has_issues": len(issues) > 0,
        "issues": issues
    }

def generate_heuristic_tutor_response(payload: AIChatRequest) -> str:
    """
    Generates intelligent pedagogical feedback tailored to student questions.
    """
    msg = payload.message.strip()
    is_mm = is_myanmar_text(msg)
    code = payload.student_code or ""
    error = payload.error_message or ""
    
    analysis = analyze_python_code(code, error)

    # Question matching keywords
    msg_lower = msg.lower()
    
    # 1. Error debugging help
    if "error" in msg_lower or "ဘာမှား" in msg or "မှား" in msg or error:
        if "SyntaxError" in error or any(i.get("type") == "syntax_error" for i in analysis["issues"]):
            if is_mm:
                return (
                    "💡 **SyntaxError သတိပြုရန်:**\n\n"
                    "SyntaxError ဆိုတာ Python ရဲ့ သဒ္ဒါစည်းကမ်း မမှန်တဲ့အခါ ပေါ်တတ်ပါတယ်။\n"
                    "- ကွင်းပိတ် `)` သို့မဟုတ် quotation mark `\"...\"` ကျန်ခဲ့လား စစ်ဆေးကြည့်ပါ။\n"
                    "- `if`, `for`, `def` စတဲ့ statement တွေရဲ့ အဆုံးမှာ colon `:` ထည့်ဖို့ မမေ့ပါနဲ့ခင်ဗျာ။\n\n"
                    "👉 Code ကို တစ်ကြောင်းချင်း သေချာပြန်လည်စစ်ဆေးကြည့်ပါ။"
                )
            else:
                return (
                    "💡 **SyntaxError Detected:**\n\n"
                    "This usually happens when Python grammar rules are broken:\n"
                    "- Check for missing closing parentheses `)` or quotes `\"`\n"
                    "- Ensure header statements (`if`, `for`, `def`) end with a colon `:`\n\n"
                    "👉 Double-check the exact line where the error occurred."
                )

        if "IndentationError" in error:
            if is_mm:
                return (
                    "💡 **IndentationError သတိပြုရန်:**\n\n"
                    "Python မှာ block တစ်ခု (ဥပမာ `if`, `for`, `def` အောက်) ရေးတဲ့အခါ အရှေ့က space (indentation) ညီဖို့ အရေးကြီးပါတယ်။\n"
                    "စာကြောင်းအစမှာ 4 spaces (သို့မဟုတ် Tab ၁ ချက်) ညီအောင် ချိန်ညှိပေးပါခင်ဗျာ။"
                )
            else:
                return (
                    "💡 **IndentationError:**\n\n"
                    "Python relies on consistent indentation. Make sure statements inside loops, functions, or conditionals are indented with 4 spaces."
                )

        if "NameError" in error:
            if is_mm:
                return (
                    "💡 **NameError သတိပြုရန်:**\n\n"
                    "သတ်မှတ်မထားသေးတဲ့ variable သို့မဟုတ် function နာမည်ကို သုံးမိတဲ့အခါ ဒီ error တက်တတ်ပါတယ်။\n"
                    "စာလုံးပေါင်း (spelling) မှန်မမှန်နှင့် variable ကို အရင်ကြေညာထားခြင်း ရှိမရှိ စစ်ဆေးကြည့်ပါ။"
                )
            else:
                return (
                    "💡 **NameError:**\n\n"
                    "You are using a variable or function name that hasn't been defined yet. Check for spelling typos and ensure variables are assigned before use."
                )

    # 2. Requesting a Hint
    if "hint" in msg_lower or "အကူအညီ" in msg or "လမ်းညွှန်" in msg or "ဘယ်လိုလုပ်" in msg:
        if payload.lesson_title:
            if is_mm:
                return (
                    f"🎯 **Lesson Hint for '{payload.lesson_title}':**\n\n"
                    "ဒီ exercise မှာ အဓိက လိုအပ်တဲ့ အဆင့်တွေကို စဉ်းစားကြည့်ပါ:\n"
                    "1. မေးခွန်းက တောင်းဆိုထားတဲ့ Output Format ကို သေချာဖတ်ပါ။\n"
                    "2. Print ထုတ်ရမယ့် စာသားအတိအကျ (Case sensitivity & spaces) ကိုက်ညီအောင် ရေးပါ။\n\n"
                    "💪 စိတ်အေးအေးထားပြီး နောက်တစ်ကြိမ် Run ကြည့်ပါခင်ဗျာ!"
                )
            else:
                return (
                    f"🎯 **Hint for '{payload.lesson_title}':**\n\n"
                    "Think about the step-by-step logic required:\n"
                    "1. Check the exact required output string and capitalization.\n"
                    "2. Verify that your variables are correctly formatted before printing.\n\n"
                    "Give it another shot!"
                )

    # 3. Concept Explanations
    if "print" in msg_lower:
        if is_mm:
            return (
                "📘 **Python `print()` Function အကြောင်း:**\n\n"
                "`print()` function သည် စာသား သို့မဟုတ် တန်ဖိုးများကို မျက်နှာပြင်ပေါ် ထုတ်ပြပေးရန် အသုံးပြုပါသည်။\n"
                "ဥပမာ:\n"
                "```python\n"
                "name = 'Alice'\n"
                "print('Hello, ' + name)\n"
                "```"
            )
        else:
            return (
                "📘 **Python `print()` Function:**\n\n"
                "`print()` outputs data to the console.\n"
                "Example:\n"
                "```python\n"
                "message = 'Welcome to Python!'\n"
                "print(message)\n"
                "```"
            )

    # 4. General Encouraging Guidance
    if is_mm:
        return (
            "🤖 **မင်္ဂလာပါ! DeepDive AI Tutor ဖြစ်ပါတယ်။**\n\n"
            "လက်ရှိ သင်ခန်းစာနဲ့ ပတ်သက်ပြီး Code အမှားရှာဖွေရန်၊ Hint ရယူရန် သို့မဟုတ် Python သဘောတရားများကို မေးမြန်းနိုင်ပါတယ်ခင်ဗျာ။\n"
            "👉 မေးလိုသည်များကို အချိန်မရွေး မေးမြန်းနိုင်ပါသည်!"
        )
    else:
        return (
            "🤖 **Hello! I'm your DeepDive AI Coding Tutor.**\n\n"
            "I'm here to help you understand Python errors, provide hints on exercises, and explain concepts step-by-step.\n"
            "👉 Feel free to ask me anything about your current lesson or code!"
        )

@router.post("/tutor", response_model=AIChatResponse)
def ask_ai_tutor(payload: AIChatRequest):
    """
    Intelligent AI Coding Tutor Endpoint for students.
    Analyzes code, errors, and queries to provide pedagogical guidance.
    """
    try:
        reply_text = generate_heuristic_tutor_response(payload)
        return AIChatResponse(
            reply=reply_text,
            hint_type="guidance"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Tutor error: {str(e)}"
        )
