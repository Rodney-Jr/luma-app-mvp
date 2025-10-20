# Setup demo data for Luma MVP
Write-Host "Setting up demo data..." -ForegroundColor Green

# Register demo counsellors
$counsellors = @(
    '{"display_name": "Dr. Sarah Johnson", "categories": ["Mental Health", "Academic"], "languages": ["English", "Spanish"], "bio": "Licensed clinical psychologist with 8 years of experience."}',
    '{"display_name": "Mike Chen", "categories": ["Career", "Academic"], "languages": ["English", "Mandarin"], "bio": "Career counselor and life coach."}',
    '{"display_name": "Dr. Amara Okafor", "categories": ["Marriage & Relationships", "Family"], "languages": ["English", "French"], "bio": "Marriage and family therapist."}',
    '{"display_name": "James Rodriguez", "categories": ["Mental Health", "Career"], "languages": ["English", "Spanish"], "bio": "Peer counselor and mental health advocate."}'
)

foreach ($counsellor in $counsellors) {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8000/api/counsellors/register" -Method POST -ContentType "application/json" -Body $counsellor
        Write-Host "Registered counsellor successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "Failed to register counsellor" -ForegroundColor Red
    }
}

Write-Host "Demo data setup complete!" -ForegroundColor Cyan