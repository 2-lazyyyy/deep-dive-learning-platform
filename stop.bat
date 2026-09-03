@echo off
title DeepDive Learn - Shutdown
color 0C

echo ========================================================
echo       DEEPDIVE LEARN: SHUTTING DOWN ALL SERVICES        
echo ========================================================
echo.

cd /d "%~dp0"

:: 1. Close all DeepDive console windows and their process trees
echo [*] Closing DeepDive console windows and worker trees...
taskkill /F /T /FI "WINDOWTITLE eq DeepDive*" >nul 2>&1

:: 2. Terminate any processes listening on ports 3000 and 8000 (Next.js & FastAPI)
echo [*] Freeing ports 3000 and 8000...
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { (Get-NetTCPConnection -LocalPort 3000,8000 -ErrorAction SilentlyContinue).OwningProcess | Select-Object -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue } } catch {}" >nul 2>&1

:: 3. Secondary native fallback for ports 3000 and 8000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /F /T /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    taskkill /F /T /PID %%a >nul 2>&1
)

:: 4. Terminate any orphan worker.py processes
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like '*worker.py*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue } } catch {}" >nul 2>&1

echo.
echo ========================================================
echo   [OK] All DeepDive Learn services have been stopped!   
echo ========================================================
echo.
ping 127.0.0.1 -n 3 >nul
