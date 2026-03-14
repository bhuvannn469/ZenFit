@echo off
echo Starting fitness tracker application...

echo Starting backend server...
start cmd /k "cd c:\Users\Bhuvan\Desktop\phitness\webpage\backend\backend && npm start"

echo Starting frontend development server...
start cmd /k "cd c:\Users\Bhuvan\Desktop\phitness\webpage\front && npm start"

echo Servers started successfully!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo IMPORTANT: If you see any errors, check that both servers are running correctly.
