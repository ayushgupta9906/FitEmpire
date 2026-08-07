@echo off
title FitEmpire Full-Stack Starter
setlocal enabledelayedexpansion

:: Set workspace root path dynamically
set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"

echo ===================================================
echo      FitEmpire - Loading Environment Config
echo ===================================================
echo.

if exist "%ROOT_DIR%\.env" (
    echo Loading variables from .env...
    for /f "usebackq eol=# tokens=1* delims==" %%A in ("%ROOT_DIR%\.env") do (
        if not "%%A"=="" (
            set "%%A=%%B"
        )
    )
    echo Environment variables loaded successfully.
) else (
    echo [WARNING] .env file not found! Using default environment properties.
)
echo.

echo ===================================================
echo      FitEmpire - Terminating Existing Processes
echo ===================================================
echo.

set "PORTS_TO_KILL=8080 3000 3001 8081"

for %%P in (%PORTS_TO_KILL%) do (
    for /f "tokens=5" %%A in ('netstat -ano ^| findstr ":%%P"') do (
        if "%%A" NEQ "0" (
            echo   -^> Port %%P is in use by PID %%A. Terminating...
            taskkill /PID %%A /F >nul 2>&1
        )
    )
)

echo Ports check complete. All specified ports are free.
echo.

echo ===================================================
echo         FitEmpire - Starting Services
echo ===================================================
echo.

echo [1/3] Starting Spring Boot Backend (Port 8080)...
start "FitEmpire Backend [Port 8080]" cmd /k "cd /d "%ROOT_DIR%\fitempire-backend" && mvn spring-boot:run"

echo [2/3] Starting Admin Dashboard (Port 3000)...
start "FitEmpire Admin [Port 3000]" cmd /k "cd /d "%ROOT_DIR%\fitempire-admin" && npm run dev"

echo [3/3] Starting Mobile App / Expo (Port 8081)...
start "FitEmpire Mobile [Expo Web :8081]" cmd /k "cd /d "%ROOT_DIR%\fitempire-mobile" && npx expo start --web --port 8081"

echo.
echo ===================================================
echo             FitEmpire Services Overview
echo ===================================================
echo  - Backend API:       http://localhost:8080/api
echo  - Swagger UI:        http://localhost:8080/api/swagger-ui.html
echo  - Admin Dashboard:   http://localhost:3000
echo  - Mobile Expo App:   http://localhost:8081
echo ===================================================
echo.
echo All services launched in separate windows.

