import os
import logging
from celery import Celery

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
def execute_code_task(submission_id: str, code: str, lang: str):
    """
    Contract for Developer 3's Distributed Execution Engine.
    This task will be picked up by Developer 3's Celery worker node,
    which spins up a disposable Docker sandbox container, executes the code,
    captures output/errors, and writes results directly back to Supabase.
    """
    logger.info(f"[Celery Queue] Enqueued code execution task for submission_id: {submission_id} (lang: {lang})")
    return {"submission_id": submission_id, "status": "enqueued"}


def queue_submission(submission_id: str, code: str, language: str):
    """
    Helper function used by FastAPI route to enqueue a submission.
    Falls back gracefully if Celery/Redis connection is offline.
    """
    try:
        task = execute_code_task.delay(submission_id=submission_id, code=code, lang=language)
        logger.info(f"Successfully sent submission {submission_id} to Redis queue. Task ID: {task.id}")
        return True
    except Exception as e:
        logger.warning(f"Could not connect to Redis broker ({e}). Submission {submission_id} saved as queued in DB.")
        return False
