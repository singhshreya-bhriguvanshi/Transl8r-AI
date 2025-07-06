@echo off
echo ========================================
echo Language Translation System Setup
echo ========================================
echo.

echo Setting up Backend...
cd backend
echo Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install backend dependencies
    pause
    exit /b 1
)

echo Creating .env file...
if not exist .env (
    copy env.example .env
    echo Backend .env file created successfully
) else (
    echo Backend .env file already exists
)
cd ..

echo.
echo Setting up Frontend...
cd frontend
echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo.
echo 1. Start Backend (Terminal 1):
echo    cd backend
echo    npm run dev
echo.
echo 2. Start Frontend (Terminal 2):
echo    cd frontend
echo    npm start
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
pause 