@echo off
echo ========================================
echo    Starting CRM System
echo ========================================
echo.

echo Starting backend server...
start "CRM Backend" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting frontend server...
start "CRM Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo    CRM System Started!
echo ========================================
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Login with:
echo Email: admin@crm.com
echo Password: admin123
echo.
echo Press any key to close this window...
pause > nul