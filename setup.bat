@echo off
echo ========================================
echo    CRM System Setup Script
echo ========================================
echo.

echo [1/6] Setting up backend dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo [2/6] Generating Prisma client...
call npm run db:generate
if %errorlevel% neq 0 (
    echo Error: Failed to generate Prisma client
    pause
    exit /b 1
)

echo.
echo [3/6] Setting up database...
call npm run db:push
if %errorlevel% neq 0 (
    echo Error: Failed to setup database
    pause
    exit /b 1
)

echo.
echo [4/6] Seeding initial data...
call npm run db:seed
if %errorlevel% neq 0 (
    echo Error: Failed to seed database
    pause
    exit /b 1
)

echo.
echo [5/6] Setting up frontend dependencies...
cd ..
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo [6/6] Setup complete!
echo.
echo ========================================
echo    Setup Completed Successfully!
echo ========================================
echo.
echo Default Login Credentials:
echo Email: admin@crm.com
echo Password: admin123
echo.
echo To start the system:
echo 1. Backend: cd server && npm run dev
echo 2. Frontend: npm run dev
echo.
echo Backend will run on: http://localhost:3001
echo Frontend will run on: http://localhost:5173
echo.
pause