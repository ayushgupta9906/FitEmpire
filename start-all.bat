@echo off
title FitEmpire Full-Stack Starter

echo ===================================================
echo      FitEmpire - Loading Environment Config
echo ===================================================
echo.

if exist .env (
    echo Loading variables from .env...
    for /f "usebackq tokens=*" %%a in (".env") do (
        echo %%a | findstr /R "^#" >nul
        if errorlevel 1 (
            set "%%a"
        )
    )
) else (
    echo Warning: .env file not found!
)

echo ===================================================
echo      FitEmpire - Terminating Existing Processes
echo ===================================================
echo.

set "PORTS_TO_KILL=8080 3000 3001 8081"

for %%P in (%PORTS_TO_KILL%) do (
    echo Checking port %%P...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%P') do (
        if "%%a" NEQ "0" (
            echo   -> Found process with PID %%a on port %%P. Terminating...
            taskkill /PID %%a /F
        )
    )
)

echo.
echo All specified ports have been cleared.
echo.
echo ===================================================
echo         FitEmpire - Starting All Services
echo ===================================================
echo.

echo Starting Backend (fitempire-backend)...
start "FitEmpire Backend" cmd /k "cd /d c:\Users\ayush-g\Desktop\FitEmpire\fitempire-backend && mvn spring-boot:run"

echo Starting Admin Dashboard (fitempire-admin)...
start "FitEmpire Admin" cmd /k "cd /d c:\Users\ayush-g\Desktop\FitEmpire\fitempire-admin && npm run dev"

echo Starting Mobile App (fitempire-mobile)...
start "FitEmpire Mobile" cmd /k "cd /d c:\Users\ayush-g\Desktop\FitEmpire\fitempire-mobile && npx expo start"

echo.
echo All services are starting up in new windows.
echo This window can now be closed.
