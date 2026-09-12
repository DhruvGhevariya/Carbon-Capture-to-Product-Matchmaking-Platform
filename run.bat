@echo off
setlocal

title CarbonX Matchmaking Platform Launcher
cd /d "%~dp0"

echo ============================================================
echo         CarbonX - Carbon Capture Matchmaking Platform
echo ============================================================
echo.

REM 1. Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not found in PATH!
    echo Please install Python 3.10+ and add it to your system PATH.
    pause
    exit /b 1
)

REM 2. Check Node and NPM
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js or NPM is not installed or not found in PATH!
    echo Please install Node.js 18+ and add it to your system PATH.
    pause
    exit /b 1
)

REM 3. Setup Backend Virtual Environment
if not exist "backend\.venv\Scripts\python.exe" (
    echo [*] Creating Python virtual environment in backend\.venv...
    python -m venv backend\.venv
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
    echo [*] Installing backend dependencies...
    backend\.venv\Scripts\python.exe -m pip install --upgrade pip
    backend\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
    if errorlevel 1 (
        echo [ERROR] Failed to install backend dependencies.
        pause
        exit /b 1
    )
)

REM 4. Verify Backend .env
if not exist "backend\.env" (
    echo [*] Generating backend\.env configuration...
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env" >nul
        echo [*] Created backend\.env from template.
    ) else (
        (
            echo PROJECT_NAME="CarbonX API"
            echo VERSION="1.0.0"
            echo API_V1_STR="/api/v1"
            echo DATABASE_URL=postgresql+asyncpg://postgres:123456@localhost:5432/carbonx
            echo SYNC_DATABASE_URL=postgresql://postgres:123456@localhost:5432/carbonx
            echo SECRET_KEY=carbonx-super-secret-production-key-for-auth-token-2026
            echo ALGORITHM=HS256
            echo ACCESS_TOKEN_EXPIRE_MINUTES=480
            echo ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
            echo ENVIRONMENT=development
            echo DEBUG=True
        ) > "backend\.env"
        echo [*] Created backend\.env with default configuration.
    )
)

REM 5. Initialize Database tables
echo [*] Checking database tables and initialization...
backend\.venv\Scripts\python.exe backend\scripts\init_db.py
if errorlevel 1 (
    echo [WARNING] Database initialization encountered an issue.
    echo Please verify PostgreSQL is running and credentials in backend\.env are correct.
)

REM 6. Setup Frontend Dependencies
if not exist "frontend\node_modules" (
    echo [*] Installing frontend npm dependencies...
    cd frontend
    call npm install
    cd ..
)

REM 7. Launch Backend Server
echo [*] Starting CarbonX Backend API on http://127.0.0.1:8000 ...
start "CarbonX Backend API" cmd /k "cd /d %~dp0backend && .venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

REM 8. Launch Frontend Dev Server
echo [*] Starting CarbonX Frontend UI on http://localhost:5173 ...
start "CarbonX Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

REM Wait 3 seconds for servers to spin up
timeout /t 3 /nobreak >nul

REM 9. Open Browser
start http://localhost:5173

echo.
echo ============================================================
echo   CarbonX Platform is now running!
echo ============================================================
echo   Frontend:  http://localhost:5173
echo   Backend:   http://127.0.0.1:8000
echo   API Docs:  http://127.0.0.1:8000/docs
echo.
echo   Demo Login Accounts:
echo   - UltraTech Cement (Seller): rajesh.verma@ultratech.com / password123
echo   - GreenGrow Chem   (Buyer):  ananya.s@greengrow.in      / password123
echo   - EcoBuild Mat     (Buyer):  vikram.m@ecobuild.in       / password123
echo.
echo   To stop all servers, run stop.bat or close the server windows.
echo ============================================================
echo.
pause
