# EVENT-CONTENTSERVICES - Event & Content Management System

## Overview
Overview: Hệ thống quản lý sự kiện và nội dung sử dụng Spring Boot, cung cấp các API RESTful cho các thao tác CRUD và hỗ trợ tích hợp với MySQL hoặc H2 database.

## Architecture
- REST API Service: Quản lý sự kiện và nội dung (Spring Boot, Java)
- Database: Hỗ trợ cả H2 (in-memory) và MySQL (production)
- API Documentation: Swagger UI để kiểm thử và khám phá API

## Features

### Event Management
1. Event CRUD: Thêm, xem, sửa, xóa sự kiện
2. Event Categories: Quản lý danh mục sự kiện
3. Event Search: Tìm kiếm và lọc sự kiện

### Content Management
1. Content CRUD: Thêm, xem, sửa, xóa nội dung
2. SEO Data: Quản lý thông tin SEO cho nội dung
3. Content Search: Tìm kiếm và lọc nội dung

## Technology Stack
- Backend: Java 17+, Spring Boot 3, Spring Data JPA, Lombok
- Database: H2 (mặc định), MySQL 8.0+ (tùy chọn)
- API Documentation: Springdoc OpenAPI (Swagger UI)
- Build Tool: Maven

## Quick Start

### Prerequisites
- Java 17 trở lên
- Maven 3.8+
- MySQL 8.0+ (nếu dùng MySQL)

### Installation
```bash
# Clone repository: Tải mã nguồn về
git clone <repository-url>
cd EVENT-CONTENTSERVICES

# Build the project: Biên dịch dự án
./mvnw clean install

# Run the application: Chạy ứng dụng
./mvnw spring-boot:run
```

### Service Endpoints
- API Base URL: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

## API Documentation

### Event APIs
```
GET    /api/events: Lấy danh sách sự kiện
POST   /api/events: Thêm sự kiện mới
GET    /api/events/{id}: Lấy thông tin sự kiện theo ID
PUT    /api/events/{id}: Cập nhật sự kiện
DELETE /api/events/{id}: Xóa sự kiện
```

### Content APIs
```
GET    /api/content: Lấy danh sách nội dung
POST   /api/content: Thêm nội dung mới
GET    /api/content/{id}: Lấy thông tin nội dung theo ID
PUT    /api/content/{id}: Cập nhật nội dung
DELETE /api/content/{id}: Xóa nội dung
```

## Database Configuration
Database Configuration: Mặc định sử dụng H2.  
Để chuyển sang MySQL, sửa file `src/main/resources/application.properties`:
```
spring.datasource.url=jdbc:mysql://localhost:3306/<your_db>
spring.datasource.username=<your_username>
spring.datasource.password=<your_password>
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

## Project Structure
```
EVENT-CONTENTSERVICES/
├── src/
│   ├── main/
│   │   ├── java/uth/edu/vn/EVENT/CONTENTSERVICES/
│   │   │   ├── controller/
│   │   │   ├── model/
│   │   │   ├── repository/
│   │   │   └── service/
│   │   └── resources/
│   │       └── application.properties
├── pom.xml
└── README.md
```

## Development

### Adding New Features
1. Follow Clean Architecture and Spring best practices: Tuân thủ kiến trúc sạch và chuẩn Spring
2. Add proper error handling and validation: Xử lý lỗi và kiểm tra dữ liệu đầu vào
3. Include unit tests: Thêm unit test
4. Update API documentation (Swagger): Cập nhật tài liệu API

## Contributing
1. Fork the repository: Tạo bản sao dự án
2. Create a feature branch: Tạo nhánh mới cho tính năng
3. Commit your changes: Commit thay đổi
4. Push to your branch: Đẩy lên nhánh của bạn
5. Create a Pull Request: Tạo Pull Request

## License
License: Dự án phục vụ mục đích học tập.

## Contact
Contact: Nếu có câu hỏi hoặc cần hỗ trợ, vui lòng liên hệ nhóm
