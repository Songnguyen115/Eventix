# 🚀 Cross-Machine Microservices Demo

## Mô tả
Demo giao tiếp giữa 2 microservices chạy trên 2 máy khác nhau:
- **Máy A**: Checkin Service (Node.js)
- **Máy B**: Payment Service (Spring Boot)
- **Kết nối**: Tailscale VPN

## 📋 Hướng dẫn Test trước khi Demo

### Trên Máy A (test trước):
```powershell
cd "Eventix features/Eventix"
.\test-payment-service.ps1
```

**Kết quả mong đợi:**
- ✅ Health Check: "Payment Service is running! Cross-machine demo ready 🚀"
- ✅ Get Payments: JSON array với 2 payments
- ✅ Get Summary: JSON object với totalPayments=2

### Nếu test OK, copy sang Máy B:

## 🔄 Deploy lên Máy B

1. **Copy folder** `Eventix features` sang máy B
2. **Chạy lệnh:**
   ```bash
   cd "Eventix features/Eventix"
   java -jar target/Eventix-0.0.1-SNAPSHOT.jar
   ```

## 🎬 Demo Script

### Bước 1: Giới thiệu (30s)
"Hôm nay em demo microservices communication giữa 2 máy khác nhau qua Tailscale VPN"

### Bước 2: Show Network (1 phút)
```powershell
# Từ máy A
ping 100.122.204.66
Test-NetConnection -ComputerName 100.122.204.66 -Port 8080
```

### Bước 3: Demo API Calls (2 phút)
```powershell
# Health check
curl http://100.122.204.66:8080/api/payments/health

# Get data
curl http://100.122.204.66:8080/api/payments

# Get summary
curl http://100.122.204.66:8080/api/payments/summary
```

### Bước 4: Explain Architecture (1 phút)
```
Máy A (100.72.224.90) ←→ Tailscale VPN ←→ Máy B (100.122.204.66)
   ↓                                           ↓
Checkin Service                          Payment Service
(Node.js:3001)                          (Spring Boot:8080)
```

## 📊 Key Points
- ✅ Cross-machine communication
- ✅ Microservices scalability  
- ✅ Technology diversity
- ✅ Network security (VPN)
- ✅ Real-world architecture

## 🔧 Troubleshooting

### Nếu không connect được:
1. Check firewall: `netsh advfirewall firewall add rule name="Spring-8080" dir=in action=allow protocol=TCP localport=8080`
2. Check service: `netstat -an | findstr :8080`
3. Test local: `curl http://localhost:8080/api/payments/health`

### Backup Demo (nếu cross-machine fail):
- Show network ping ✅
- Show port connectivity ✅  
- Explain architecture và benefits

**Total Demo Time: ~5 phút + Q&A**
