# 🚀 Setup Payment Service trên Máy B

## 📋 Yêu cầu hệ thống
- Java 17+ 
- Maven 3.6+
- Windows/Linux/Mac

## 🔧 Các bước setup

### 1. Copy code từ máy A
```bash
# Copy toàn bộ folder "Eventix features" từ máy A sang máy B
# Đảm bảo có đầy đủ các file:
# - src/main/java/ (tất cả Payment entities, services, controllers)
# - src/main/resources/application.properties
# - pom.xml
# - target/ (sau khi build)
```

### 2. Build project
```bash
# Di chuyển vào thư mục project
cd "Eventix features/Eventix"

# Build project (tạo JAR file)
mvn clean package -DskipTests
```

### 3. Chạy Payment Service
```bash
# Chạy service với database thật
java -jar target/Eventix-0.0.1-SNAPSHOT.jar
```

### 4. Kiểm tra service đã chạy
```bash
# Kiểm tra port 8080
netstat -an | findstr :8080

# Test health endpoint
curl http://localhost:8080/api/payments/health
```

## 🎯 Expected Results

### Khi service start thành công, bạn sẽ thấy:
```
✅ Sample payment data initialized successfully!
🚀 Payment Service ready for real database demo!
INFO --- Tomcat started on port 8080 (http) with context path '/'
```

### Test endpoints:
```bash
# Health check
curl http://localhost:8080/api/payments/health
# Response: "Payment Service is running! Real database ready 🚀"

# Payment summary (từ database thật)
curl http://localhost:8080/api/payments/summary
# Response: {"totalPayments":13,"successfulPayments":9,"totalAmount":1965000.0,...}

# All payments (từ database thật)
curl http://localhost:8080/api/payments
# Response: [{"id":1,"amount":150000,"paymentMethod":"BANK_TRANSFER",...}, ...]
```

## 🔧 Troubleshooting

### Lỗi "Unable to access jarfile"
```bash
# Đảm bảo đang ở đúng thư mục
cd "Eventix features/Eventix"
ls target/Eventix-0.0.1-SNAPSHOT.jar

# Nếu không có file JAR, build lại:
mvn clean package -DskipTests
```

### Lỗi "Port 8080 already in use"
```bash
# Tìm process đang dùng port 8080
netstat -ano | findstr :8080

# Kill process (thay PID bằng số thực tế)
taskkill /PID <PID> /F
```

### Lỗi Java version
```bash
# Kiểm tra Java version
java -version

# Cần Java 17+
# Nếu chưa có, download từ: https://adoptium.net/
```

## 📊 Database Information

### H2 Database (In-memory)
- **URL:** `jdbc:h2:mem:testdb`
- **Console:** `http://localhost:8080/h2-console`
- **Username:** `sa`
- **Password:** `password`

### Sample Data
- **13 payment records** được tạo tự động khi start
- **9 successful payments** 
- **Total amount:** 1,965,000 VND
- **Various payment methods:** BANK_TRANSFER, MOMO, VNPAY, etc.

## 🌐 Cross-Machine Communication

### Từ máy A, test kết nối đến máy B:
```bash
# Thay IP_MACHINE_B bằng IP thực của máy B
curl http://IP_MACHINE_B:8080/api/payments/health
curl http://IP_MACHINE_B:8080/api/payments/summary
```

### Cấu hình Checkin Service trên máy A:
```typescript
// File: Eventix/checkin-service/src/infrastructure/external/PaymentServiceRepository.ts
const baseUrl = 'http://IP_MACHINE_B:8080/api/payments';
```

## ✅ Checklist Setup

- [ ] Java 17+ installed
- [ ] Maven installed  
- [ ] Code copied from machine A
- [ ] `mvn clean package -DskipTests` successful
- [ ] `java -jar target/Eventix-0.0.1-SNAPSHOT.jar` running
- [ ] Port 8080 listening
- [ ] Health endpoint responding
- [ ] Database initialized with sample data
- [ ] Ready for cross-machine communication

---

## 🎉 **Kết quả cuối cùng:**
**Payment Service chạy trên máy B với database thật, sẵn sàng nhận API calls từ máy A!**
