import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from root .env and backend/.env
root_env = Path(__file__).resolve().parent.parent / ".env"
root_env_local = Path(__file__).resolve().parent.parent / ".env.local"
backend_env = Path(__file__).resolve().parent / ".env"
if root_env.exists():
    load_dotenv(dotenv_path=root_env, override=True)
if root_env_local.exists():
    load_dotenv(dotenv_path=root_env_local, override=True)
if backend_env.exists():
    load_dotenv(dotenv_path=backend_env, override=True)

SUPABASE_URL: str = os.getenv("SUPABASE_URL", "") or os.getenv("NEXT_PUBLIC_SUPABASE_URL", "") or "http://mock.supabase.co"
if not SUPABASE_URL.startswith("http"):
    SUPABASE_URL = "http://mock.supabase.co"
SUPABASE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "") or os.getenv("SUPABASE_KEY", "") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "") or "mock_key"

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_supabase() -> Client:
    """Dependency injector for FastAPI routes."""
    return supabase
