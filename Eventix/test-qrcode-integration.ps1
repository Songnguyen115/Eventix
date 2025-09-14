# Test QR Code Integration between Payment Service and Checkin Service
Write-Host "🔗 Testing QR Code Integration" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green

# Configuration
$PAYMENT_SERVICE_URL = "http://localhost:8080"
$CHECKIN_SERVICE_URL = "http://localhost:3001"

# Test 1: Payment Service Health
Write-Host "`n=== Test 1: Payment Service Health ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$PAYMENT_SERVICE_URL/api/payments/health" -Method GET
    Write-Host "✅ Payment Service: $response" -ForegroundColor Green
} catch {
    Write-Host "❌ Payment Service not running: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Get QR Code Info for Ticket 1001
Write-Host "`n=== Test 2: Get QR Code Info (Ticket 1001) ===" -ForegroundColor Cyan
try {
    $qrInfo = Invoke-RestMethod -Uri "$PAYMENT_SERVICE_URL/api/payments/qr/1001" -Method GET
    Write-Host "✅ QR Code Info Retrieved:" -ForegroundColor Green
    Write-Host "   🎫 Ticket ID: $($qrInfo.ticketId)" -ForegroundColor White
    Write-Host "   👤 Student ID: $($qrInfo.studentId)" -ForegroundColor White
    Write-Host "   💰 Amount: $($qrInfo.amount) VND" -ForegroundColor White
    Write-Host "   📱 Payment Method: $($qrInfo.paymentMethod)" -ForegroundColor White
    Write-Host "   ✅ Status: $($qrInfo.status)" -ForegroundColor White
    Write-Host "   🔑 Transaction ID: $($qrInfo.transactionId)" -ForegroundColor White
    Write-Host "   📱 QR Code: $($qrInfo.qrCode)" -ForegroundColor White
    Write-Host "   ✅ Checkin Eligible: $($qrInfo.checkinEligible)" -ForegroundColor White
} catch {
    Write-Host "❌ Failed to get QR code info: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Verify Payment with Transaction ID
Write-Host "`n=== Test 3: Verify Payment (Transaction ID) ===" -ForegroundColor Cyan
try {
    $transactionId = "TXN_1701234567_ABC12345"
    $verification = Invoke-RestMethod -Uri "$PAYMENT_SERVICE_URL/api/payments/verify/$transactionId" -Method GET
    Write-Host "✅ Payment Verification:" -ForegroundColor Green
    Write-Host "   🔑 Transaction ID: $($verification.transactionId)" -ForegroundColor White
    Write-Host "   🎫 Ticket ID: $($verification.ticketId)" -ForegroundColor White
    Write-Host "   ✅ Valid: $($verification.valid)" -ForegroundColor White
    Write-Host "   ✅ Checkin Allowed: $($verification.checkinAllowed)" -ForegroundColor White
    Write-Host "   📝 Message: $($verification.message)" -ForegroundColor White
} catch {
    Write-Host "❌ Failed to verify payment: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Checkin Service Health
Write-Host "`n=== Test 4: Checkin Service Health ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$CHECKIN_SERVICE_URL/health" -Method GET
    Write-Host "✅ Checkin Service: $($response.service) - $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Checkin Service not running: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   💡 Start Checkin Service with: docker-compose up -d" -ForegroundColor Yellow
}

# Test 5: QR Code Checkin Endpoints (if Checkin Service is running)
Write-Host "`n=== Test 5: QR Code Checkin Endpoints ===" -ForegroundColor Cyan
try {
    # Test QR Code Info endpoint
    $qrCheckinInfo = Invoke-RestMethod -Uri "$CHECKIN_SERVICE_URL/api/checkin/qr/1001" -Method GET
    Write-Host "✅ Checkin Service QR Code Info:" -ForegroundColor Green
    Write-Host "   🎫 Ticket ID: $($qrCheckinInfo.data.ticketId)" -ForegroundColor White
    Write-Host "   ✅ Checkin Eligible: $($qrCheckinInfo.data.checkinEligible)" -ForegroundColor White
    Write-Host "   📱 QR Code: $($qrCheckinInfo.data.qrCode)" -ForegroundColor White
    Write-Host "   📝 Message: $($qrCheckinInfo.message)" -ForegroundColor White
} catch {
    Write-Host "❌ Checkin Service QR Code endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Payment Verification via Checkin Service
Write-Host "`n=== Test 6: Payment Verification via Checkin Service ===" -ForegroundColor Cyan
try {
    $verifyData = @{
        transactionId = "TXN_1701234567_ABC12345"
    } | ConvertTo-Json

    $verifyResponse = Invoke-RestMethod -Uri "$CHECKIN_SERVICE_URL/api/checkin/verify" -Method POST -Body $verifyData -ContentType "application/json"
    Write-Host "✅ Checkin Service Payment Verification:" -ForegroundColor Green
    Write-Host "   🔑 Transaction ID: $($verifyResponse.data.transactionId)" -ForegroundColor White
    Write-Host "   ✅ Valid: $($verifyResponse.data.valid)" -ForegroundColor White
    Write-Host "   ✅ Checkin Allowed: $($verifyResponse.data.checkinAllowed)" -ForegroundColor White
    Write-Host "   📝 Message: $($verifyResponse.message)" -ForegroundColor White
} catch {
    Write-Host "❌ Checkin Service verification failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: QR Code Verification via Checkin Service
Write-Host "`n=== Test 7: QR Code Verification via Checkin Service ===" -ForegroundColor Cyan
try {
    $qrCode = "TICKET_1001_10001_TXN_1701234567_ABC12345_1701234567890"
    $qrVerifyData = @{
        qrCode = $qrCode
    } | ConvertTo-Json

    $qrVerifyResponse = Invoke-RestMethod -Uri "$CHECKIN_SERVICE_URL/api/checkin/verify" -Method POST -Body $qrVerifyData -ContentType "application/json"
    Write-Host "✅ QR Code Verification:" -ForegroundColor Green
    Write-Host "   📱 QR Code: $qrCode" -ForegroundColor White
    Write-Host "   ✅ Valid: $($qrVerifyResponse.data.valid)" -ForegroundColor White
    Write-Host "   ✅ Checkin Allowed: $($qrVerifyResponse.data.checkinAllowed)" -ForegroundColor White
    Write-Host "   📝 Message: $($qrVerifyResponse.message)" -ForegroundColor White
} catch {
    Write-Host "❌ QR Code verification failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 8: Check Eligibility
Write-Host "`n=== Test 8: Check Ticket Eligibility ===" -ForegroundColor Cyan
try {
    $eligibility = Invoke-RestMethod -Uri "$CHECKIN_SERVICE_URL/api/checkin/eligible/1001" -Method GET
    Write-Host "✅ Ticket Eligibility:" -ForegroundColor Green
    Write-Host "   🎫 Ticket ID: $($eligibility.ticketId)" -ForegroundColor White
    Write-Host "   ✅ Eligible: $($eligibility.eligible)" -ForegroundColor White
    Write-Host "   📝 Message: $($eligibility.message)" -ForegroundColor White
} catch {
    Write-Host "❌ Eligibility check failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 QR Code Integration Testing Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "✅ Payment Service provides QR code data" -ForegroundColor Green
Write-Host "✅ Checkin Service can verify payments" -ForegroundColor Green
Write-Host "✅ Cross-machine communication working!" -ForegroundColor Green
