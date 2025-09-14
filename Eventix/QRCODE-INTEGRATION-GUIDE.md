# 🔗 QR Code Integration Guide

## 📋 Tổng quan
Checkin Service giờ đã có thể lấy thông tin QR code từ Payment Service để thực hiện checkin.

## 🚀 API Endpoints mới

### Payment Service (Máy B - Port 8080)

#### 1. Get QR Code Info
```bash
GET /api/payments/qr/{ticketId}
```
**Response:**
```json
{
  "ticketId": 1001,
  "studentId": 10001,
  "amount": 150000,
  "paymentMethod": "BANK_TRANSFER",
  "status": "SUCCESS",
  "transactionId": "TXN_1701234567_ABC12345",
  "paymentDate": "2024-01-15T10:30:00",
  "description": "Payment for Spring Boot Workshop",
  "qrCode": "TICKET_1001_10001_TXN_1701234567_ABC12345_1701234567890",
  "checkinEligible": true,
  "message": "QR code data retrieved successfully"
}
```

#### 2. Verify Payment
```bash
GET /api/payments/verify/{transactionId}
```
**Response:**
```json
{
  "transactionId": "TXN_1701234567_ABC12345",
  "ticketId": 1001,
  "studentId": 10001,
  "status": "SUCCESS",
  "valid": true,
  "amount": 150000,
  "paymentMethod": "BANK_TRANSFER",
  "checkinAllowed": true,
  "message": "Payment verified - Checkin allowed"
}
```

### Checkin Service (Máy A - Port 3001)

#### 1. Get QR Code Info
```bash
GET /api/checkin/qr/{ticketId}
```

#### 2. Verify Payment
```bash
POST /api/checkin/verify
Content-Type: application/json

{
  "transactionId": "TXN_1701234567_ABC12345"
}
```

#### 3. Verify QR Code
```bash
POST /api/checkin/verify
Content-Type: application/json

{
  "qrCode": "TICKET_1001_10001_TXN_1701234567_ABC12345_1701234567890"
}
```

#### 4. Check Eligibility
```bash
GET /api/checkin/eligible/{ticketId}
```

## 🔄 Workflow Checkin với QR Code

### 1. Student mua vé và thanh toán
- Payment Service tạo payment record trong database
- Payment status = SUCCESS

### 2. Student đến checkin
- Scan QR code hoặc nhập ticket ID
- Checkin Service gọi Payment Service để verify
- Nếu payment SUCCESS → cho phép checkin
- Nếu payment FAILED/PENDING → từ chối checkin

### 3. Cross-machine Communication
```
Student → Checkin Service (Máy A) → Payment Service (Máy B)
```

## 🧪 Test Commands

### Test Payment Service QR Code
```bash
# Get QR code info
curl http://localhost:8080/api/payments/qr/1001

# Verify payment
curl http://localhost:8080/api/payments/verify/TXN_1701234567_ABC12345
```

### Test Checkin Service Integration
```bash
# Get QR code via Checkin Service
curl http://localhost:3001/api/checkin/qr/1001

# Verify payment via Checkin Service
curl -X POST http://localhost:3001/api/checkin/verify \
  -H "Content-Type: application/json" \
  -d '{"transactionId": "TXN_1701234567_ABC12345"}'

# Verify QR code via Checkin Service
curl -X POST http://localhost:3001/api/checkin/verify \
  -H "Content-Type: application/json" \
  -d '{"qrCode": "TICKET_1001_10001_TXN_1701234567_ABC12345_1701234567890"}'
```

## 📊 QR Code Format
```
TICKET_{TICKET_ID}_{STUDENT_ID}_{TRANSACTION_ID}_{TIMESTAMP}
```

**Example:** `TICKET_1001_10001_TXN_1701234567_ABC12345_1701234567890`

## ✅ Benefits

1. **Real-time Payment Verification**: Checkin Service có thể verify payment status real-time
2. **Cross-machine Communication**: 2 services giao tiếp qua HTTP API
3. **Database Integration**: Sử dụng database thật thay vì mock data
4. **QR Code Support**: Hỗ trợ cả transaction ID và QR code
5. **Error Handling**: Xử lý lỗi khi payment không tồn tại hoặc failed

## 🎯 Demo cho thầy

1. **Start Payment Service** (Máy B):
   ```bash
   java -jar target/Eventix-0.0.1-SNAPSHOT.jar
   ```

2. **Start Checkin Service** (Máy A):
   ```bash
   docker-compose up -d
   ```

3. **Test Integration**:
   ```bash
   # Test QR code từ Payment Service
   curl http://100.122.204.66:8080/api/payments/qr/1001
   
   # Test qua Checkin Service
   curl http://localhost:3001/api/checkin/qr/1001
   ```

## 🎉 Kết quả
**Checkin Service giờ đã có thể lấy thông tin QR code từ Payment Service để thực hiện checkin dựa trên payment status thật từ database!**
