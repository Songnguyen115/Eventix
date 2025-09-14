# Test script cho Payment Service
Write-Host "=== PAYMENT SERVICE TEST SUITE ===" -ForegroundColor Green
Write-Host "Máy A testing Payment Service trước khi deploy lên máy B" -ForegroundColor Yellow
Write-Host ""

# Start Payment Service
Write-Host "Starting Payment Service..." -ForegroundColor Cyan
Start-Process -FilePath "java" -ArgumentList "-jar", "target/Eventix-0.0.1-SNAPSHOT.jar" -WindowStyle Hidden
Write-Host "⏳ Waiting 15 seconds for service to start..." -ForegroundColor Yellow
Start-Sleep 15

Write-Host ""
Write-Host "=== RUNNING TESTS ===" -ForegroundColor Green

# Test 1: Health Check
Write-Host "1. Testing Health Check..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/payments/health" -Method GET -TimeoutSec 10
    Write-Host "   ✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "   ❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Get Payments
Write-Host "2. Testing Get All Payments..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/payments" -Method GET -TimeoutSec 10
    Write-Host "   ✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "   ❌ Get payments failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Get Summary
Write-Host "3. Testing Payment Summary..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/payments/summary" -Method GET -TimeoutSec 10
    Write-Host "   ✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "   ❌ Get summary failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== TEST COMPLETED ===" -ForegroundColor Green
Write-Host "Nếu tất cả test ✅ thì có thể copy code sang máy B!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Nhấn Enter để stop Payment Service..."
Read-Host
Get-Process -Name "java" | Where-Object {$_.CommandLine -like "*Eventix*"} | Stop-Process -Force
Write-Host "Payment Service stopped." -ForegroundColor Red
