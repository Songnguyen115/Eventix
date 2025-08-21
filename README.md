# Eventix - Event Management System

## Overview
Eventix là hệ thống quản lý sự kiện với kiến trúc microservices, bao gồm Checkin Service và Analytics Service.

## Architecture
- **Checkin Service**: Quản lý đăng ký và check-in cho sự kiện
- **Analytics Service**: Phân tích dữ liệu và báo cáo thống kê
- **Shared Database**: MySQL database được chia sẻ giữa các services
- **Message Broker**: RabbitMQ cho giao tiếp giữa các services

## Features

### Analytics Service
1. **Dashboard Metrics**: Thống kê real-time về attendance và engagement
2. **Reports**: Báo cáo chi tiết về sự kiện và attendance
3. **Survey Management**: Quản lý khảo sát và feedback

### Checkin Service
1. **Event Management**: Quản lý sự kiện
2. **Attendee Registration**: Đăng ký tham dự viên
3. **QR Code Check-in**: Check-in bằng QR code
4. **Real-time Updates**: Cập nhật real-time

## Technology Stack
- **Backend**: Node.js, TypeScript, Express.js
- **Database**: MySQL 8.0
- **Cache**: Redis
- **Message Broker**: RabbitMQ
- **Containerization**: Docker, Docker Compose
- **Architecture**: Clean Architecture, Microservices

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Git

### Installation
```bash
# Clone repository
git clone <repository-url>
cd Eventix

# Start all services
docker-compose -f docker-compose.eventix.yml up -d

# Check services status
docker-compose -f docker-compose.eventix.yml ps
```

### Services Endpoints
- **Checkin Service**: http://localhost:3001
- **Analytics Service**: http://localhost:3003
- **Database**: localhost:3308
- **phpMyAdmin**: http://localhost:8080
- **RabbitMQ Management**: http://localhost:15673

## API Documentation

### Analytics Service APIs

#### Dashboard Metrics
```
GET /analytics/dashboard/metrics/{eventId}
GET /analytics/metrics/{eventId}
```

#### Reports
```
GET /analytics/reports/attendance/{eventId}
GET /analytics/reports/summary/{eventId}
GET /analytics/reports/stats
```

#### Survey Management
```
GET /surveys/event/{eventId}/data
GET /surveys
POST /surveys
```

### Checkin Service APIs
```
GET /checkin/events
POST /checkin/events
GET /checkin/attendees
POST /checkin/attendees
POST /checkin/checkin
```

## Database Schema
Database được chia sẻ giữa Checkin Service và Analytics Service với các bảng chính:
- `events`: Thông tin sự kiện
- `attendees`: Thông tin tham dự viên
- `analytics_events`: Sự kiện analytics
- `surveys`: Khảo sát
- `survey_responses`: Phản hồi khảo sát

## Development

### Project Structure
```
Eventix/
├── analytics-service/     # Analytics microservice
├── checkin-service/       # Checkin microservice
├── docker-compose.eventix.yml
└── README.md
```

### Adding New Features
1. Follow Clean Architecture principles
2. Add proper error handling
3. Include unit tests
4. Update API documentation

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is for educational purposes.

## Contact
For questions and support, please contact the development team.
