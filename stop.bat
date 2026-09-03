@echo off
title DeepDive Learn - Shutdown
color 0C

echo ========================================================
echo       DEEPDIVE LEARN: SHUTTING DOWN ALL SERVICES        
echo ========================================================
echo.

echo [*] Stopping services on ports 3000 and 8000...
powershell -NoProfile -Command "try { Get-NetTCPConnection -LocalPort 3000,8000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } } catch {}"

echo [*] Closing DeepDive console windows...
taskkill /F /FI "WINDOWTITLE eq DeepDive*" >nul 2>&1

echo.
echo [OK] All DeepDive Learn services have been stopped successfully!
echo.
timeout /t 3 /nobreak >nul
