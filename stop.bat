@echo off
title Stop CarbonX Servers
echo Stopping CarbonX Platform Servers...

:: Kill processes on port 8000 (Backend) and 5173 (Frontend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo Terminating backend process on PID %%a...
    taskkill /F /PID %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo Terminating frontend process on PID %%a...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo All CarbonX servers stopped.
timeout /t 2 /nobreak >nul
