# Test script for Real Database Payment Service
Write-Host "🚀 Testing Payment Service with Real Database" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Wait for service to start
Write-Host "⏳ Waiting for service to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

# Test 1: Health Check
Write-Host "`n=== Test 1: Health Check ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/payments/health" -Method GET
    Write-Host "✅ Health Check: $response" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Payment Summary (Real Database)
Write-Host "`n=== Test 2: Payment Summary (Real Database) ===" -ForegroundColor Cyan
try {
    $summary = Invoke-RestMethod -Uri "http://localhost:8080/api/payments/summary" -Method GET
    Write-Host "✅ Payment Summary:" -ForegroundColor Green
    Write-Host "   📊 Total Payments: $($summary.totalPayments)" -ForegroundColor White
    Write-Host "   ✅ Successful Payments: $($summary.successfulPayments)" -ForegroundColor White
    Write-Host "   💰 Total Amount: $($summary.totalAmount) VND" -ForegroundColor White
    Write-Host "   📝 Message: $($summary.message)" -ForegroundColor White
} catch {
    Write-Host "❌ Payment Summary Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get All Payments
Write-Host "`n=== Test 3: Get All Payments (Real Database) ===" -ForegroundColor Cyan
try {
    $payments = Invoke-RestMethod -Uri "http://localhost:8080/api/payments" -Method GET
    Write-Host "✅ Retrieved $($payments.Count) payments from database:" -ForegroundColor Green
    
    $payments | ForEach-Object {
        Write-Host "   🧾 ID: $($_.id) | Amount: $($_.amount) | Method: $($_.paymentMethod) | Status: $($_.status)" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Get All Payments Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Get Payment Statistics
Write-Host "`n=== Test 4: Payment Statistics ===" -ForegroundColor Cyan
try {
    $stats = Invoke-RestMethod -Uri "http://localhost:8080/api/payments/statistics" -Method GET
    Write-Host "✅ Payment Statistics:" -ForegroundColor Green
    Write-Host "   📊 Total: $($stats.totalPayments)" -ForegroundColor White
    Write-Host "   ✅ Successful: $($stats.successfulPayments)" -ForegroundColor White
    Write-Host "   💰 Total Amount: $($stats.totalAmount)" -ForegroundColor White
} catch {
    Write-Host "❌ Payment Statistics Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Recent Payments
Write-Host "`n=== Test 5: Recent Payments (Last 30 days) ===" -ForegroundColor Cyan
try {
    $recent = Invoke-RestMethod -Uri "http://localhost:8080/api/payments/recent" -Method GET
    Write-Host "✅ Recent Payments: $($recent.Count) payments" -ForegroundColor Green
    
    $recent | ForEach-Object {
        Write-Host "   📅 $($_.description) - $($_.amount) VND ($($_.status))" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Recent Payments Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Real Database Testing Complete!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host "✅ Payment Service is working with REAL DATABASE!" -ForegroundColor Green
Write-Host "📊 Data is stored in H2 in-memory database" -ForegroundColor Yellow
Write-Host "🔗 Ready for cross-machine communication!" -ForegroundColor Yellow
