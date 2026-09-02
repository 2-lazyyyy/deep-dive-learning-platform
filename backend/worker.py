import os
import sys
import logging
import subprocess
import tempfile
import time
from datetime import datetime, timezone
from celery import Celery

# Import supabase to update the results directly
from database import supabase

logger = logging.getLogger(__name__)

REDIS_URL = os.getenv("REDIS_URL", "redis://127.0.0.1:6379/0")

celery_app = Celery(
    "execution_worker",
    broker=REDIS_URL,
    backend=REDIS_URL
)

# Standard alias for Celery CLI
app = celery_app
celery = celery_app

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    worker_enable_remote_control=False,
    worker_send_task_events=False,
    broker_connection_retry_on_startup=True,
)

@celery_app.task(name="execute_code_task")
def execute_code_task(submission_id: str, code: str, lang: str, is_practice: bool = False):
    logger.info(f"[Celery Worker] Starting execution for submission: {submission_id}")
    
    # Mark as running in DB
    try:
        supabase.table("submissions").update({"status": "running"}).eq("id", submission_id).execute()
    except Exception as e:
        logger.error(f"Failed to update status to running: {e}")
    
    start_time = time.time()
    
    # 1. Fetch lesson exercise_data and expected output
    test_code = ""
    expected_output = ""
    xp_reward = 15
    user_id = None
    lesson_id = None
    
    try:
        sub_res = supabase.table("submissions").select("user_id, lesson_id").eq("id", submission_id).execute()
        if sub_res.data and len(sub_res.data) > 0:
            user_id = sub_res.data[0]["user_id"]
            lesson_id = sub_res.data[0]["lesson_id"]
            lesson_res = supabase.table("lessons").select("exercise_data, xp_reward").eq("id", lesson_id).execute()
            if lesson_res.data and len(lesson_res.data) > 0:
                l_data = lesson_res.data[0]
                xp_reward = l_data.get("xp_reward", 15)
                exercise_data = l_data.get("exercise_data") or {}
                test_code = exercise_data.get("testCode", "")
                expected_output = exercise_data.get("expectedOutput", "")
    except Exception as e:
        logger.error(f"[Celery Worker] Failed to fetch lesson metadata: {e}")
        
    combined_code = code + ("\n\n" + test_code if test_code else "")

    # 2. Layer 1: Static AST Security Sandbox Check
    from security import validate_code_ast
    is_safe, sec_warning = validate_code_ast(combined_code)
    
    if not is_safe:
        output = ""
        error = sec_warning
        passed = False
        ret_code = 1
    else:
        # 3. Layer 2: Hardened Process-Level Sandbox Execution
        clean_env = {
            "PYTHONIOENCODING": "utf-8",
            "PYTHONUNBUFFERED": "1"
        }
        try:
            run_res = subprocess.run(
                [sys.executable, "-I", "-E", "-c", combined_code],
                capture_output=True,
                text=True,
                timeout=3.0,
                env=clean_env
            )
            output = run_res.stdout
            error = run_res.stderr
            ret_code = run_res.returncode
            
            if expected_output:
                passed = (output.strip() == expected_output.strip()) and (ret_code == 0)
            else:
                passed = (ret_code == 0) and not error
        except subprocess.TimeoutExpired:
            output = ""
            error = "Execution timed out (Limit: 3 seconds).\nအချိန်သတ်မှတ်ချက် (၃ စက္ကန့်) ကျော်လွန်သွားပါသည်။"
            passed = False
            ret_code = 124
        except Exception as e:
            output = ""
            error = str(e)
            passed = False
            ret_code = 1

    # Truncate output/error buffers to 10KB
    MAX_OUTPUT_LEN = 10 * 1024
    if len(output) > MAX_OUTPUT_LEN:
        output = output[:MAX_OUTPUT_LEN] + "\n...[Output truncated: Exceeded 10KB limit]"
    if len(error) > MAX_OUTPUT_LEN:
        error = error[:MAX_OUTPUT_LEN] + "\n...[Error truncated: Exceeded 10KB limit]"

    execution_time_ms = int((time.time() - start_time) * 1000)
    status_str = "completed" if passed else "error"
    
    # 4. Update Supabase with results
    try:
        supabase.table("submissions").update({
            "status": status_str,
            "passed": passed,
            "output": output,
            "error": error,
            "execution_time_ms": execution_time_ms
        }).eq("id", submission_id).execute()
        logger.info(f"[Celery Worker] Finished {submission_id} in {execution_time_ms}ms (passed={passed})")
        
        # 5. Gamification: Update XP and Hearts
        if user_id:
            user_res = supabase.table("users").select("xp, hearts").eq("id", user_id).execute()
            if user_res.data and len(user_res.data) > 0:
                current_xp = user_res.data[0].get("xp", 0)
                current_hearts = user_res.data[0].get("hearts", 5)
                
                if passed:
                    reward = 5 if is_practice else xp_reward
                    supabase.table("users").update({"xp": current_xp + reward}).eq("id", user_id).execute()
                    logger.info(f"[Gamification] Added {reward} XP to user {user_id}")
                else:
                    if not is_practice:
                        new_hearts = max(0, current_hearts - 1)
                        updates = {"hearts": new_hearts}
                        if current_hearts == 5 and new_hearts < 5:
                            updates["last_heart_update"] = datetime.now(timezone.utc).isoformat()
                        supabase.table("users").update(updates).eq("id", user_id).execute()
                        logger.info(f"[Gamification] Deducted 1 heart from user {user_id}. Remaining: {new_hearts}")
    except Exception as e:
        logger.error(f"[Celery Worker] Failed to update results or gamification: {e}")

    return {
        "submission_id": submission_id,
        "status": status_str,
        "passed": passed,
        "output": output,
        "error": error,
        "execution_time_ms": execution_time_ms
    }


def queue_submission(submission_id: str, code: str, language: str, is_practice: bool = False):
    """
    Helper function used by FastAPI route to enqueue a submission.
    Falls back gracefully if Celery/Redis connection is offline.
    """
    try:
        task = execute_code_task.delay(submission_id=submission_id, code=code, lang=language, is_practice=is_practice)
        logger.info(f"Successfully sent submission {submission_id} to Redis queue. Task ID: {task.id}")
        return True
    except Exception as e:
        logger.warning(f"Could not connect to Redis broker ({e}). Submission {submission_id} saved as queued in DB.")
        return False

if __name__ == '__main__':
    celery_app.worker_main(['worker', '--loglevel=info', '--pool=solo', '--without-gossip', '--without-mingle', '--without-heartbeat'])
