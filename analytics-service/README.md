# Eventix Analytics Service

Analytics Service cho hệ thống quản lý sự kiện Eventix, cung cấp các chức năng báo cáo, dashboard metrics và quản lý khảo sát.

## 🚀 Tính năng chính

### 📊 Analytics & Reporting
- **Tracking Analytics Events**: Theo dõi các sự kiện như page view, button click, form submit, API call
- **Dashboard Metrics**: Tạo và quản lý các metrics cho dashboard
- **Report Generation**: Tạo báo cáo tự động cho attendance, revenue, survey, sponsor
- **Real-time Analytics**: Cập nhật real-time thông qua Socket.IO

### 📝 Survey Management
- **Survey Creation**: Tạo và quản lý khảo sát với nhiều loại câu hỏi
- **Question Types**: Hỗ trợ multiple choice, single choice, text, rating, scale
- **Survey Distribution**: Phân phối khảo sát qua email, attendee, user
- **Response Tracking**: Theo dõi trạng thái và phản hồi khảo sát

### 🔗 Inter-service Communication
- **Message Broker**: Sử dụng RabbitMQ để giao tiếp với các microservice khác
- **Event-driven Architecture**: Xử lý events từ checkin service, ticket service
- **API Integration**: RESTful API để tích hợp với frontend và các service khác

## 🏗️ Kiến trúc

```
src/
├── application/          # Use Cases (Business Logic)
│   ├── use-cases/
│   │   ├── TrackAnalyticsEventUseCase.ts
│   │   ├── GenerateDashboardMetricsUseCase.ts
│   │   ├── GenerateReportUseCase.ts
│   │   └── ManageSurveyUseCase.ts
├── domain/              # Domain Layer (Entities, Interfaces)
│   ├── entities/
│   │   ├── AnalyticsEvent.ts
│   │   ├── DashboardMetric.ts
│   │   ├── Report.ts
│   │   └── Survey.ts
│   └── repositories/
│       ├── IAnalyticsRepository.ts
│       └── ISurveyRepository.ts
├── infrastructure/      # Infrastructure Layer (Database, External Services)
│   └── database/
│       ├── MySQLAnalyticsRepository.ts
│       └── MySQLSurveyRepository.ts
├── presentation/        # Presentation Layer (Controllers, Routes, Middleware)
│   ├── controllers/
│   │   ├── AnalyticsController.ts
│   │   └── SurveyController.ts
│   ├── routes/
│   │   ├── analytics.routes.ts
│   │   └── survey.routes.ts
│   └── middleware/
│       ├── errorHandler.ts
│       └── rateLimitMiddleware.ts
├── app.ts              # Main Application Class
└── index.ts            # Service Entry Point
```

## 🛠️ Cài đặt và Chạy

### Yêu cầu hệ thống
- Node.js >= 18.0.0
- MySQL 8.0+
- Redis 7+
- RabbitMQ 3.8+

### 1. Clone và cài đặt dependencies
```bash
cd Eventix/analytics-service
npm install
```

### 2. Cấu hình môi trường
```bash
cp env.example .env
# Chỉnh sửa .env với thông tin database và service
```

### 3. Khởi động với Docker
```bash
docker-compose up -d
```

### 4. Khởi động development mode
```bash
npm run dev
```

## 📡 API Endpoints

### Analytics
- `POST /api/v1/analytics/events` - Track analytics event
- `POST /api/v1/analytics/events/batch` - Track batch events
- `GET /api/v1/analytics/metrics` - Generate dashboard metrics
- `GET /api/v1/analytics/events/:eventId/metrics` - Get metrics by event
- `POST /api/v1/analytics/reports` - Generate report
- `GET /api/v1/analytics/events/:eventId/summary` - Get analytics summary

### Surveys
- `POST /api/v1/surveys` - Create survey
- `GET /api/v1/surveys` - Get surveys
- `GET /api/v1/surveys/:id` - Get survey by ID
- `PUT /api/v1/surveys/:id` - Update survey
- `DELETE /api/v1/surveys/:id` - Delete survey
- `PATCH /api/v1/surveys/:id/activate` - Activate survey
- `PATCH /api/v1/surveys/:id/deactivate` - Deactivate survey

### Survey Questions
- `POST /api/v1/surveys/:surveyId/questions` - Add question
- `GET /api/v1/surveys/:surveyId/questions` - Get survey questions
- `PUT /api/v1/surveys/questions/:id` - Update question
- `DELETE /api/v1/surveys/questions/:id` - Delete question

### Survey Responses
- `POST /api/v1/surveys/responses` - Submit response
- `GET /api/v1/surveys/responses` - Get survey responses
- `GET /api/v1/surveys/:surveyId/responses/summary` - Get response summary

### Survey Distribution
- `POST /api/v1/surveys/:surveyId/distribute` - Distribute survey
- `GET /api/v1/surveys/distributions` - Get survey distributions

## 🔌 Inter-service Communication

### RabbitMQ Queues
- `analytics.events` - Nhận events từ các service khác
- `analytics.reports` - Xử lý yêu cầu tạo báo cáo
- `analytics.surveys` - Quản lý khảo sát

### Event Topics
- `event.*` - Các events liên quan đến sự kiện
- `report.*` - Các events liên quan đến báo cáo
- `survey.*` - Các events liên quan đến khảo sát

## 📊 Database Schema

Service sử dụng MySQL với các bảng chính:
- `analytics_events` - Lưu trữ analytics events
- `dashboard_metrics` - Metrics cho dashboard
- `reports` - Báo cáo được tạo
- `surveys` - Khảo sát
- `survey_questions` - Câu hỏi khảo sát
- `survey_responses` - Phản hồi khảo sát
- `survey_distribution` - Phân phối khảo sát

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker
```bash
docker build -t eventix-analytics-service .
docker run -p 3002:3002 eventix-analytics-service
```

### Environment Variables
```bash
# Server
NODE_ENV=production
PORT=3002
API_VERSION=v1

# Database
DB_HOST=your-db-host
DB_PORT=3306
DB_NAME=eventix_analytics
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379

# RabbitMQ
RABBITMQ_HOST=your-rabbitmq-host
RABBITMQ_PORT=5672
RABBITMQ_USER=your-rabbitmq-user
RABBITMQ_PASS=your-rabbitmq-password

# SMTP (for survey emails)
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📝 Logging

Service sử dụng Winston cho logging:
- Log level: `info` (development), `warn` (production)
- Log file: `./logs/analytics-service.log`
- Console output trong development mode

## 🔒 Security

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API rate limiting
- **Input Validation**: Request validation
- **Error Handling**: Centralized error handling

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 🆘 Support

- **Issues**: Tạo issue trên GitHub
- **Documentation**: Xem API docs và examples
- **Team**: Liên hệ team Eventix

---

**Eventix Analytics Service** - Cung cấp insights và analytics cho hệ thống quản lý sự kiện 🎯
