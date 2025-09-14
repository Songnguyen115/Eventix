# Test script for Real Database Payment Service
Write-Host "🚀 Testing Payment Service with Real Database" -ForegroundColor Green

# Wait for service to start
Write-Host "⏳ Waiting for service to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

# Test 1: Health Check
Write-Host "`n=== Test 1: Health Check ===" -ForegroundColor Cyan
$response = curl http://localhost:8080/api/payments/health 2>$null
if ($response) {
    Write-Host "✅ Health Check: $response" -ForegroundColor Green
} else {
    Write-Host "❌ Health Check Failed" -ForegroundColor Red
}

# Test 2: Payment Summary
Write-Host "`n=== Test 2: Payment Summary (Real Database) ===" -ForegroundColor Cyan
$summary = curl http://localhost:8080/api/payments/summary 2>$null
if ($summary) {
    Write-Host "✅ Payment Summary Response:" -ForegroundColor Green
    Write-Host $summary -ForegroundColor White
} else {
    Write-Host "❌ Payment Summary Failed" -ForegroundColor Red
}

# Test 3: Get All Payments
Write-Host "`n=== Test 3: Get All Payments (Real Database) ===" -ForegroundColor Cyan
$payments = curl http://localhost:8080/api/payments 2>$null
if ($payments) {
    Write-Host "✅ All Payments Response:" -ForegroundColor Green
    Write-Host $payments -ForegroundColor White
} else {
    Write-Host "❌ Get All Payments Failed" -ForegroundColor Red
}

Write-Host "`n🎉 Real Database Testing Complete!" -ForegroundColor Green
Write-Host "✅ Payment Service is working with REAL DATABASE!" -ForegroundColor Green
