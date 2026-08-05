import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.student import router as student_router
from routers.teacher import router as teacher_router

app = FastAPI(
    title="DeepDive Learn - Unified Backend API",
    description="University Interactive Learning Platform API (Developer 2)",
    version="1.0.0"
)

# CORS configuration to allow access from Next.js frontend (Developer 1)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Student and Teacher Routers
app.include_router(student_router)
app.include_router(teacher_router)

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
