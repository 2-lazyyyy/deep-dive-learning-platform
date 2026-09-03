@echo off
title DeepDive Learn - Launcher
color 0B

echo ========================================================
echo       DEEPDIVE LEARN: ALL-IN-ONE SYSTEM LAUNCHER        
echo ========================================================
echo.

cd /d "%~dp0"

where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not installed or not in system PATH!
    pause
    exit /b 1
)

where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js / npm is not installed or not in system PATH!
    pause
    exit /b 1
)

echo [*] [1/3] Starting Backend API (FastAPI on port 8000)...
start "DeepDive_Backend" cmd /k "cd /d %~dp0backend & title DeepDive_Backend & python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

echo [*] [2/3] Starting Execution Worker (Celery daemon)...
start "DeepDive_Worker" cmd /k "cd /d %~dp0backend & title DeepDive_Worker & python worker.py"

echo [*] [3/3] Starting Frontend (Next.js on port 3000)...
start "DeepDive_Frontend" cmd /k "cd /d %~dp0 & title DeepDive_Frontend & npm run dev"

echo.
echo ========================================================
echo   All services launched successfully!
echo   ------------------------------------------------------
echo   Frontend Web App : http://localhost:3000
echo   Backend API      : http://127.0.0.1:8000
echo   Interactive Docs : http://127.0.0.1:8000/docs
echo ========================================================
echo.
echo Opening browser in 5 seconds...
timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo All services are running in background terminal windows.
echo To stop all services cleanly, double-click 'stop.bat'.
echo.
pause
