# EVENT-CONTENTSERVICES - Event & Content Management System

## Overview
Eventix là hệ thống quản lý sự kiện với kiến trúc microservices, bao gồm hai thành phần chính: event service và contentservices

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
# Clone repository
git clone <repository-url>
cd EVENT-CONTENTSERVICES

# Build the project
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

### Service Endpoints
- API Base URL: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

## API Documentation

### Event APIs
```
GET    /api/events
POST   /api/events
GET    /api/events/{id}
PUT    /api/events/{id}
DELETE /api/events/{id}
```

### Content APIs
```
GET    /api/content
POST   /api/content
GET    /api/content/{id}
PUT    /api/content/{id}
DELETE /api/content/{id}
```

## Database Configuration
Database Configuration 
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
1. Follow Clean Architecture and Spring best practices
2. Add proper error handling and validation
3. Include unit tests
4. Update API documentation (Swagger)

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

## License
This project is for educational purposes.

## Contact
For questions and support, please contact the development team.
