# Check-in Service - Eventix

Microservice quản lý check-in và theo dõi tham dự cho hệ thống tổ chức sự kiện Eventix.

## Tính năng chính

- **Attendance Tracking**: Theo dõi sự tham dự của khách hàng
- **Sponsor Booth Management**: Quản lý gian hàng của nhà tài trợ
- **Real-time Check-in**: Check-in thời gian thực với QR code

## Cấu trúc Clean Architecture

```
checkin-service/
├── src/
│   ├── domain/           # Business logic & entities
│   ├── application/      # Use cases & application services
│   ├── infrastructure/   # External interfaces & implementations
│   └── presentation/     # Controllers & DTOs
├── tests/                # Unit & integration tests
├── docker/               # Docker configuration
└── docs/                 # API documentation
```

## Công nghệ sử dụng

- **Language**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Message Queue**: Redis
- **Authentication**: JWT
- **Testing**: Jest

## Cài đặt và chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development
npm run dev

# Chạy tests
npm test

# Build production
npm run build
```

## API Endpoints

- `POST /api/v1/checkin` - Check-in khách hàng
- `GET /api/v1/attendance/:eventId` - Lấy danh sách tham dự
- `POST /api/v1/sponsor-booth` - Tạo gian hàng sponsor
- `GET /api/v1/sponsor-booth/:boothId/visitors` - Lấy danh sách khách ghé thăm
