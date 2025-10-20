# Luma MVP Startup Script
Write-Host "Starting Luma MVP..." -ForegroundColor Green

# Set environment variables
$env:LUMA_DB_PATH = "$PWD\data\luma.sqlite3"

# Create data directory if it doesn't exist
if (!(Test-Path "data")) {
    New-Item -ItemType Directory -Path "data"
    Write-Host "Created data directory" -ForegroundColor Yellow
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\.venv\Scripts\Activate.ps1

# Install backend dependencies if needed
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
pip install -r backend/requirements.txt

# Start backend in background
Write-Host "Starting backend server on http://localhost:8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-Command", "& .\.venv\Scripts\Activate.ps1; `$env:LUMA_DB_PATH = '$PWD\data\luma.sqlite3'; uvicorn app.main:app --reload --app-dir backend --port 8000"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install

# Start frontend
Write-Host "Starting frontend server on http://localhost:3000..." -ForegroundColor Green
Write-Host ""
Write-Host "=== Luma MVP is starting ===" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Yellow

npm run dev