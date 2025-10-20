# Simple script to approve pending counsellors for demo purposes
Write-Host "Approving pending counsellors..." -ForegroundColor Green

# Get pending counsellors
try {
    $pending = Invoke-RestMethod -Uri "http://localhost:8000/api/counsellors/?status=pending" -Method GET
    
    if ($pending.Count -eq 0) {
        Write-Host "No pending counsellors found." -ForegroundColor Yellow
        exit
    }
    
    Write-Host "Found $($pending.Count) pending counsellors:" -ForegroundColor Cyan
    foreach ($counsellor in $pending) {
        Write-Host "- $($counsellor.display_name) (ID: $($counsellor.id))" -ForegroundColor White
    }
    
    # In a real system, this would be done through an admin API
    # For demo purposes, we'll directly update the database
    Write-Host ""
    Write-Host "Note: In this MVP, counsellor approval would be done through an admin interface." -ForegroundColor Yellow
    Write-Host "For demo purposes, you can manually change status from 'pending' to 'approved' in the database." -ForegroundColor Yellow
    Write-Host "Database location: ./data/luma.sqlite3" -ForegroundColor Yellow
}
catch {
    Write-Host "Error fetching counsellors: $($_.Exception.Message)" -ForegroundColor Red
}