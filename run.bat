@echo off
title DeepDive Learn - Launcher
color 0B

echo ========================================================
echo       DEEPDIVE LEARN: ALL-IN-ONE SYSTEM LAUNCHER        
echo ========================================================
echo.

:: Ensure current working directory is project root
cd /d "%~dp0"

:: 1. Verify Python availability
where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not installed or not found in system PATH!
    echo Please install Python 3.10+ and add it to PATH.
    pause
    exit /b 1
)

:: 2. Verify Node / npm availability
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js / npm is not installed or not in system PATH!
    echo Please install Node.js 18+ and add it to PATH.
    pause
    exit /b 1
)

:: 3. Clean up stale or orphan processes on ports 3000 and 8000 to prevent port collisions
echo [*] Checking and freeing ports 3000 and 8000...
powershell -NoProfile -Command "try { Get-NetTCPConnection -LocalPort 3000,8000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } } catch {}" >nul 2>&1

:: 4. Verify node_modules
if not exist "node_modules" (
    echo [*] Installing frontend dependencies...
    call npm install
)

:: 5. Launch Backend API (FastAPI on port 8000)
echo [*] [1/3] Starting Backend API on port 8000...
start "DeepDive_Backend" /D "%~dp0backend" cmd /k "title DeepDive_Backend && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

:: 6. Launch Execution Worker (Celery daemon)
echo [*] [2/3] Starting Execution Worker...
start "DeepDive_Worker" /D "%~dp0backend" cmd /k "title DeepDive_Worker && python worker.py"

:: 7. Launch Frontend (Next.js on port 3000)
echo [*] [3/3] Starting Frontend on port 3000...
start "DeepDive_Frontend" /D "%~dp0" cmd /k "title DeepDive_Frontend && npm run dev"

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
ping 127.0.0.1 -n 6 >nul
start http://localhost:3000

echo.
echo All services are running in background terminal windows.
echo To stop all services cleanly, double-click 'stop.bat'.
echo.
pause
