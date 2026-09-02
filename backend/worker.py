import os
import logging
import subprocess
import tempfile
import time
from datetime import datetime, timezone
from celery import Celery

# Import supabase to update the results directly
from database import supabase

logger = logging.getLogger(__name__)

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "execution_worker",
    broker=REDIS_URL,
    backend=REDIS_URL
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
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
    
    # Create a temporary directory for the code
    with tempfile.TemporaryDirectory() as temp_dir:
        script_path = os.path.join(temp_dir, "script.py")
        
        # Fetch test_code from lessons table
        test_code = ""
        try:
            sub_res = supabase.table("submissions").select("lesson_id").eq("id", submission_id).execute()
            if sub_res.data and len(sub_res.data) > 0:
                lesson_id = sub_res.data[0]["lesson_id"]
                lesson_res = supabase.table("lessons").select("exercise_data").eq("id", lesson_id).execute()
                if lesson_res.data and len(lesson_res.data) > 0:
                    exercise_data = lesson_res.data[0].get("exercise_data") or {}
                    test_code = exercise_data.get("testCode", "")
        except Exception as e:
            logger.error(f"Failed to fetch test code: {e}")
            
        combined_code = code + "\n\n" + test_code
        
        with open(script_path, "w") as f:
            f.write(combined_code)
            
        # Spin up disposable Docker Sandbox (with local fallback if docker is offline)
        docker_cmd = [
            "docker", "run", "--rm", 
            "-v", f"{temp_dir}:/app", 
            "-w", "/app", 
            "--memory", "128m",
            "--cpus", "0.5",
            "--network", "none",
            "python:3.10-alpine", 
            "sh", "-c", "timeout 5 python script.py"
        ]
        
        try:
            result = subprocess.run(
                docker_cmd,
                capture_output=True,
                text=True,
                timeout=10
            )
            
            output = result.stdout
            error = result.stderr
            passed = (result.returncode == 0) and not error
            
            if result.returncode == 143 or result.returncode == 124: # timeout exit codes
                error = "Execution timed out (Limit: 5 seconds)."
                passed = False
                
        except Exception as docker_err:
            logger.info(f"Docker sandbox unavailable ({docker_err}), executing in isolated local Python runner...")
            try:
                # Direct local execution fallback
                local_res = subprocess.run(
                    [sys.executable, script_path],
                    capture_output=True,
                    text=True,
                    timeout=5
                )
                output = local_res.stdout
                error = local_res.stderr
                passed = (local_res.returncode == 0) and not error
            except subprocess.TimeoutExpired:
                output = ""
                error = "Execution timed out (Limit: 5 seconds)."
                passed = False
            except Exception as e:
                output = ""
                error = str(e)
                passed = False
            
    execution_time_ms = int((time.time() - start_time) * 1000)
    
    # Update Supabase with results
    try:
        supabase.table("submissions").update({
            "status": "completed" if passed else "error",
            "passed": passed,
            "output": output,
            "error": error,
            "execution_time_ms": execution_time_ms
        }).eq("id", submission_id).execute()
        logger.info(f"[Celery Worker] Finished {submission_id} in {execution_time_ms}ms")
        
        # Gamification: Update XP and Hearts
        sub_res = supabase.table("submissions").select("user_id, lesson_id").eq("id", submission_id).execute()
        if sub_res.data and len(sub_res.data) > 0:
            user_id = sub_res.data[0]["user_id"]
            lesson_id = sub_res.data[0]["lesson_id"]
            
            # Fetch lesson xp_reward
            lesson_res = supabase.table("lessons").select("xp_reward").eq("id", lesson_id).execute()
            xp_reward = lesson_res.data[0].get("xp_reward", 15) if lesson_res.data else 15
            
            # Fetch user
            user_res = supabase.table("users").select("xp, hearts").eq("id", user_id).execute()
            if user_res.data and len(user_res.data) > 0:
                current_xp = user_res.data[0].get("xp", 0)
                current_hearts = user_res.data[0].get("hearts", 5)
                
                if passed:
                    if is_practice:
                        xp_reward = 5
                    supabase.table("users").update({"xp": current_xp + xp_reward}).eq("id", user_id).execute()
                    logger.info(f"[Gamification] Added {xp_reward} XP to user {user_id} (Practice: {is_practice})")
                else:
                    if not is_practice:
                        new_hearts = max(0, current_hearts - 1)
                        updates = {"hearts": new_hearts}
                        if current_hearts == 5 and new_hearts < 5:
                            updates["last_heart_update"] = datetime.now(timezone.utc).isoformat()
                            
                        supabase.table("users").update(updates).eq("id", user_id).execute()
                        logger.info(f"[Gamification] Deducted 1 heart from user {user_id}. Remaining: {new_hearts}")
                    else:
                        logger.info(f"[Gamification] Practice mode failed, no hearts deducted for user {user_id}")
    except Exception as e:
        logger.error(f"Failed to update results or gamification progress: {e}")

    return {"submission_id": submission_id, "passed": passed}

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
