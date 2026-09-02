import os
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from routers.student import router as student_router
from routers.teacher import router as teacher_router
from routers.ai import router as ai_router

app = FastAPI(
    title="DeepDive Learn - Unified Backend API",
    description="University Interactive Learning Platform API (Developer 2)",
    version="1.0.0"
)

# OWASP Recommended Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# CORS configuration: Allow local Next.js frontend and configured production origins
allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
allowed_origins = [
    origin.strip() for origin in allowed_origins_env.split(",")
] if allowed_origins_env else [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins_env else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

# Register Student, Teacher, and AI Routers
app.include_router(student_router)
app.include_router(teacher_router)
app.include_router(ai_router)

@app.get("/")
def root():
    return {
        "service": "DeepDive Learn Backend API",
        "status": "online",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
