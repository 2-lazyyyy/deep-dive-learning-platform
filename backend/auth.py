from typing import Optional, Dict, Any
from fastapi import Depends, HTTPException, status, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import supabase

security = HTTPBearer(auto_error=False)

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Security(security)) -> Dict[str, Any]:
    """
    Validates Supabase JWT Access Token and retrieves the user profile from database.
    """
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided. Please log in.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    try:
        # Validate JWT token with Supabase Auth
        auth_response = supabase.auth.get_user(token)
        if not auth_response or not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired authentication session.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        auth_user = auth_response.user
        user_id = str(auth_user.id)
        user_email = auth_user.email

        # Fetch profile from public.users table
        res = supabase.table("users").select("id, name, email, role, xp, hearts, gems").eq("id", user_id).execute()

        if res.data and len(res.data) > 0:
            profile = res.data[0]
            return {
                "id": profile["id"],
                "email": profile["email"],
                "name": profile.get("name", user_email.split("@")[0]),
                "role": profile.get("role", "student"),
                "xp": profile.get("xp", 0),
                "hearts": profile.get("hearts", 5),
                "gems": profile.get("gems", 500),
            }

        # Fallback profile if user was created via Supabase Auth before trigger
        user_meta = auth_user.user_metadata or {}
        role = user_meta.get("role", "student")
        name = user_meta.get("name", user_email.split("@")[0] if user_email else "User")

        # Auto-insert into public.users
        insert_res = supabase.table("users").insert({
            "id": user_id,
            "email": user_email,
            "name": name,
            "role": role,
            "xp": 0,
            "hearts": 5,
            "gems": 500
        }).execute()

        if insert_res.data and len(insert_res.data) > 0:
            profile = insert_res.data[0]
            return profile

        return {
            "id": user_id,
            "email": user_email,
            "name": name,
            "role": role,
            "xp": 0,
            "hearts": 5,
            "gems": 500,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


def require_student(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """Ensures the authenticated user is at least a student."""
    return current_user


def require_teacher(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """Ensures the authenticated user has the 'teacher' role."""
    if current_user.get("role") != "teacher":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Teacher privileges required to access this resource."
        )
    return current_user
