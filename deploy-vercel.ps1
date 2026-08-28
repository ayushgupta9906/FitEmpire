Write-Host "Starting Vercel Deployment for FitEmpire projects..." -ForegroundColor Green
Write-Host "This will open your browser to log into Vercel if you aren't already logged in." -ForegroundColor Yellow
Write-Host ""

Write-Host "Deploying fitempire-web..." -ForegroundColor Cyan
Set-Location fitempire-web
npx vercel --yes
Set-Location ..

Write-Host ""
Write-Host "Deploying fitempire-partner..." -ForegroundColor Cyan
Set-Location fitempire-partner
npx vercel --yes
Set-Location ..

Write-Host ""
Write-Host "Deploying fitempire-showcase..." -ForegroundColor Cyan
Set-Location fitempire-showcase
npx vercel --yes
Set-Location ..

Write-Host ""
Write-Host "Deploying fitempire-mobile (Web Build)..." -ForegroundColor Cyan
Set-Location fitempire-mobile
npm run build
npx vercel --yes --prod
Set-Location ..

Write-Host ""
Write-Host "All deployments successfully triggered!" -ForegroundColor Green
Write-Host "Check your Vercel Dashboard for the live URLs." -ForegroundColor Yellow
Pause
