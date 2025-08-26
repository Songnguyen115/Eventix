# Eventix Frontend - Setup Instructions

## 📋 Yêu cầu

- **Node.js**: >= 18.0.0
- **Docker**: Để chạy backend services
- **code backend**: Để chạy frontend với chức năng checkin

## 🚀 Cách chạy (3 bước)

### Bước 1: Cài đặt dependencies
```bash
cd eventix-frontend
npm install
```

### Bước 2: Khởi động Backend
```bash
cd ../Eventix
docker-compose -f docker-compose.eventix.yml up -d
```

### Bước 3: Khởi động Frontend
```bash
cd ../eventix-frontend
npm run dev
```

➜ **Mở browser**: `http://localhost:3000/checkin/attendance`

## 📝 Test chức năng Check-in

1. Nhập **Event ID** hoặc chọn nhanh:
   ```
   550e8400-e29b-41d4-a716-446655440000  # FU Business Seminar 2024
   550e8400-e29b-41d4-a716-446655440100  # UTH Tech Conference 2024  
   550e8400-e29b-41d4-a716-446655440101  # UTH Career Fair 2024
   ```

2. Nhấn **"Tải Event"** để load danh sách attendees

3. Nhấn **"Manual Check-in"** để check-in attendees

## ❌ Troubleshooting

### Lỗi "API không trả về dữ liệu"
```bash
# Kiểm tra backend đang chạy
docker ps

# Test API
curl http://localhost:3001/health
curl http://localhost:3003/health
```

### Lỗi Dependencies
```bash
# Reinstall
rm -rf node_modules package-lock.json
npm install
```

## ⚠️ Lưu ý

- Frontend cần backend chạy để hoạt động
- Nếu không có backend: chỉ hiển thị form nhập Event ID
- Có backend: load được danh sách attendees và check-in được
