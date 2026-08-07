@echo off
title FitEmpire - Stop All Services
setlocal enabledelayedexpansion

echo ===================================================
echo      FitEmpire - Stopping All Services
echo ===================================================
echo.

set "PORTS=8080 3000 3001 8081"

for %%P in (%PORTS%) do (
    echo Checking port %%P...
    for /f "tokens=5" %%A in ('netstat -ano ^| findstr ":%%P"') do (
        if "%%A" NEQ "0" (
            echo   -^> Terminating process with PID %%A on port %%P...
            taskkill /PID %%A /F >nul 2>&1
        )
    )
)

echo.
echo Terminating leftover Java (Backend) processes...
taskkill /IM java.exe /F >nul 2>&1

echo Terminating leftover Node (Frontend/Expo) processes...
taskkill /IM node.exe /F >nul 2>&1

echo.
echo ===================================================
echo      All FitEmpire services have been stopped.
echo ===================================================
echo.
