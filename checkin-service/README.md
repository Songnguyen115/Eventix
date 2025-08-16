# Check-in Service - Eventix

Microservice quản lý check-in và theo dõi tham dự cho hệ thống tổ chức sự kiện Eventix.

## 🚀 Tính năng chính

- **QR Code Check-in**: Check-in thời gian thực với QR code validation
- **Attendance Tracking**: Theo dõi sự tham dự của khách hàng
- **Sponsor Booth Management**: Quản lý gian hàng của nhà tài trợ
- **Real-time Updates**: Cập nhật trạng thái tham dự theo thời gian thực
- **Rate Limiting**: Bảo vệ API khỏi spam và abuse

## 🏗️ Cấu trúc Clean Architecture

```
checkin-service/
├── src/
│   ├── domain/           # Business logic & entities
│   ├── application/      # Use cases & application services
│   ├── infrastructure/   # External interfaces & implementations
│   └── presentation/     # Controllers, routes & middleware
├── database/             # Database schema & migrations
├── scripts/              # Utility scripts
└── docker-compose.yml    # Docker orchestration
```

## 🛠️ Công nghệ sử dụng

- **Language**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: MySQL 8.0
- **Cache**: Redis
- **Authentication**: JWT
- **Containerization**: Docker & Docker Compose
- **Rate Limiting**: express-rate-limit

## 📋 Yêu cầu hệ thống

- Node.js 18+
- Docker & Docker Compose
- MySQL 8.0
- Redis

## 🚀 Cài đặt và chạy

### 1. Clone repository
```bash
git clone <repository-url>
cd checkin-service
```

### 2. Cấu hình môi trường
```bash
# Copy file cấu hình mẫu
cp .env.example .env

# Chỉnh sửa các biến môi trường trong .env
nano .env
```

### 3. Chạy với Docker (Khuyến nghị)
```bash
# Khởi động tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f checkin-service

# Dừng services
docker-compose down
```

### 4. Chạy development (Local)
```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Chạy tests
npm test

# Build production
npm run build
```

## 🗄️ Database Setup

### Khởi tạo database
```bash
# Chạy MySQL container
docker-compose up -d mysql

# Import schema
docker exec -i checkin-service-mysql-1 mysql -u eventix -ppassword eventix_checkin < database/mysql_schema.sql
```

### Kết nối database viewer
- **Host**: `127.0.0.1`
- **Port**: `3306`
- **Username**: `eventix`
- **Password**: `password`
- **Database**: `eventix_checkin`

## 🔌 API Endpoints

### Health Check
- `GET /health` - Kiểm tra trạng thái service

### Check-in Management
- `POST /api/v1/checkin/checkin` - Check-in attendee với QR code
- `GET /api/v1/checkin/validate-qr/:qrCode` - Validate QR code
- `GET /api/v1/checkin/attendance/:eventId` - Lấy báo cáo tham dự

### Sponsor Booth Management
- `POST /api/v1/sponsor-booth` - Tạo gian hàng sponsor
- `GET /api/v1/sponsor-booth/:boothId/visitors` - Lấy danh sách khách ghé thăm

## 🧪 Testing

### Sử dụng Postman

```bash
# Health check
curl http://localhost:3001/health

# Check-in attendee
curl -X POST http://localhost:3001/api/v1/checkin/checkin \
  -H "Content-Type: application/json" \
  -d '{
    "qrCode": "event-demo-2024:nguyen-van-a",
    "checkedInBy": "demo-admin"
  }'

# Validate QR code
curl http://localhost:3001/api/v1/checkin/validate-qr/event-demo-2024:nguyen-van-a

# Get attendance report
curl http://localhost:3001/api/v1/checkin/attendance/550e8400-e29b-41d4-a716-446655440000
```

## 🔧 Cấu hình môi trường

### Biến môi trường chính:
```env
# Server
NODE_ENV=development
PORT=3001

# Database
DB_HOST=mysql
DB_PORT=3306
DB_NAME=eventix_checkin
DB_USER=eventix
DB_PASSWORD=password

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🐛 Troubleshooting

### Database connection issues
```bash
# Kiểm tra MySQL container
docker ps | grep mysql

# Test connection
docker exec -it checkin-service-mysql-1 mysql -u eventix -ppassword -e "SHOW DATABASES;"

# Restart services
docker-compose restart
```

### Common errors
- **Connection timeout**: Kiểm tra DB_HOST và DB_PORT
- **Unauthorized**: Đảm bảo JWT token hợp lệ hoặc sử dụng demo mode
- **JSON parse error**: Kiểm tra format dữ liệu trong database

## 📝 Development Notes

- Service hỗ trợ **demo mode** để bypass JWT authentication
- Rate limiting được áp dụng cho tất cả check-in endpoints
- Database sử dụng connection pooling để tối ưu performance
- Tất cả API responses theo format chuẩn với error handling

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request

## 📄 License

This project is licensed under the MIT License.
