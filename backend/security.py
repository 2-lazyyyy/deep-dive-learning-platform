"""
DeepDive Learn - Python Code Execution Security Guard
Implements AST-based pre-execution static analysis to prevent:
- Remote Code Execution (RCE)
- Arbitrary file system access / modification
- System reconnaissance and process execution
- Network egress / socket abuse (SSRF)
- Python sandbox introspection escapes (__subclasses__, __globals__, etc.)
"""

import ast
from typing import Tuple

# Disallowed libraries and modules
FORBIDDEN_MODULES = {
    # System & OS commands
    "os", "sys", "subprocess", "shutil", "commands", "pty", "posix", "nt",
    # Low-level & runtime hacking
    "ctypes", "inspect", "gc", "builtins", "__builtin__", "signal",
    # Network & SSRF
    "socket", "urllib", "requests", "http", "ftplib", "smtplib", "xmlrpc", "asyncio",
    # Multiprocessing & DoS
    "multiprocessing", "threading", "concurrent",
    # File & Path manipulation
    "pathlib", "glob", "tempfile", "io",
    # Code generation & serialization
    "pickle", "marshal", "shelve", "importlib"
}

# Disallowed builtin calls
FORBIDDEN_CALLS = {
    "eval", "exec", "open", "compile", "__import__",
    "globals", "locals", "getattr", "setattr", "delattr",
    "breakpoint", "help", "exit", "quit"
}

# Disallowed introspection and escape attributes
FORBIDDEN_ATTRIBUTES = {
    "__subclasses__", "__bases__", "__base__", "__mro__",
    "__globals__", "__code__", "__builtins__", "__dict__",
    "__class__", "__reduce__", "__reduce_ex__"
}

MAX_CODE_LENGTH = 15000  # Prevent parser DoS


def validate_student_code(code: str) -> Tuple[bool, str]:
    """
    Statically analyzes student Python code for security hazards before execution.
    Returns (is_safe: bool, rejection_reason: str).
    """
    if not code:
        return True, ""

    if len(code) > MAX_CODE_LENGTH:
        return False, (
            "Security Alert: Submitted code exceeds maximum allowed size (15,000 characters).\n"
            "လုံခြုံရေးသတိပေးချက်- ကုဒ်စာသားပမာဏ သတ်မှတ်ထားသည်ထက် များပြားနေပါသည်။"
        )

    try:
        tree = ast.parse(code)
    except SyntaxError:
        # Let the Python runner report genuine syntax errors naturally
        return True, ""

    for node in ast.walk(tree):
        # 1. Check direct imports: import os, import sys
        if isinstance(node, ast.Import):
            for alias in node.names:
                root_module = alias.name.split(".")[0].lower()
                if root_module in FORBIDDEN_MODULES:
                    return False, (
                        f"Security Alert: Import of module '{alias.name}' is prohibited in this learning environment.\n"
                        f"လုံခြုံရေးသတိပေးချက်- '{alias.name}' module ကို အသုံးပြုခွင့် ကန့်သတ်ထားပါသည်။"
                    )

        # 2. Check from-imports: from os import system, from subprocess import run
        elif isinstance(node, ast.ImportFrom):
            if node.module:
                root_module = node.module.split(".")[0].lower()
                if root_module in FORBIDDEN_MODULES:
                    return False, (
                        f"Security Alert: Import from '{node.module}' is prohibited in this learning environment.\n"
                        f"လုံခြုံရေးသတိပေးချက်- '{node.module}' module ထဲမှ ခေါ်ယူအသုံးပြုခွင့် မရှိပါ။"
                    )

        # 3. Check forbidden function calls: open(), eval(), exec()
        elif isinstance(node, ast.Call):
            # Direct calls like open('file.txt')
            if isinstance(node.func, ast.Name):
                func_name = node.func.id
                if func_name in FORBIDDEN_CALLS:
                    return False, (
                        f"Security Alert: Use of built-in '{func_name}()' is prohibited.\n"
                        f"လုံခြုံရေးသတိပေးချက်- '{func_name}()' function ကို အသုံးပြုခွင့် မရှိပါ။"
                    )

        # 4. Check dangerous attribute access: ().__class__.__subclasses__()
        elif isinstance(node, ast.Attribute):
            attr_name = node.attr
            if attr_name in FORBIDDEN_ATTRIBUTES:
                return False, (
                    f"Security Alert: Access to restricted attribute '{attr_name}' is not allowed.\n"
                    f"လုံခြုံရေးသတိပေးချက်- '{attr_name}' attribute သို့ ဝင်ရောက်ခွင့် မရှိပါ။"
                )

    return True, ""

# Alias for security validator
validate_code_ast = validate_student_code
