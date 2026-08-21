# FitEmpire Ecosystem Starter (PowerShell)
$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "      FitEmpire - Starting All Ecosystem Services" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# Terminate existing processes on key ports
$ports = @(8080, 3000, 3001, 8081)
foreach ($port in $ports) {
    $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conns) {
        foreach ($conn in $conns) {
            Write-Host "  -> Port $port is in use by PID $($conn.OwningProcess). Terminating..." -ForegroundColor Yellow
            Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
        }
    }
}

Write-Host "Ports are free. Starting services..." -ForegroundColor Green

# 1. Backend
Start-Process cmd.exe -ArgumentList "/k cd /d `"$rootDir\fitempire-backend`" && mvn.cmd spring-boot:run"
Write-Host "  [1/4] Backend booting on http://localhost:8080/api (or Cloud: https://ayush150152-fitempire-api.hf.space)" -ForegroundColor Green

# 2. Admin
Start-Process cmd.exe -ArgumentList "/k cd /d `"$rootDir\fitempire-admin`" && npm.cmd run dev"
Write-Host "  [2/4] Super Admin Dashboard booting on http://localhost:3000" -ForegroundColor Green

# 3. Partner
Start-Process cmd.exe -ArgumentList "/k cd /d `"$rootDir\fitempire-partner`" && npm.cmd run dev"
Write-Host "  [3/4] Gym Partner Portal booting on http://localhost:3001" -ForegroundColor Green

# 4. Mobile
Start-Process cmd.exe -ArgumentList "/k cd /d `"$rootDir\fitempire-mobile`" && npx.cmd expo start --web --port 8081"
Write-Host "  [4/4] Member Mobile Web booting on http://localhost:8081" -ForegroundColor Green

if (Test-Path "$rootDir\fitempire-showcase\index.html") {
    Start-Process "$rootDir\fitempire-showcase\index.html"
}

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  All FitEmpire services launched successfully!" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
