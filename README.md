# Ticketing & Payment Service – Deployment Guide

## Công nghệ sử dụng

* **Java 21**
* **Spring Boot 3.5.4** (Web, JPA, Security, AMQP, WebSocket, Actuator, Admin)
* **Maven**
* **Microsoft SQL Server** (JDBC Driver)
* **Lombok**
* **ZXing** (QR Code Generator)
* **Docker & Docker Compose**

---

## Yêu cầu hệ thống

* Cài đặt **Java 21**
* Cài đặt **Maven 3.9+**
* Cài đặt **Docker & Docker Compose**

---

## Cấu hình cơ sở dữ liệu

Trong file `application.properties`:

```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=Eventix;encrypt=false
spring.datasource.username=sa
spring.datasource.password=YourPassword123
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Swagger UI
springdoc.swagger-ui.path=/swagger-ui.html

# QR Code output path
app.qrcode.output=./qrcodes/
```

---

## Cách chạy trực tiếp (local)

```bash
# Build dự án
mvn clean package -DskipTests

# Chạy ứng dụng
mvn spring-boot:run
```

Ứng dụng chạy tại: [http://localhost:8080](http://localhost:8080)

Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

## Chạy bằng Docker Compose

1. Mở terminal tại thư mục chứa `docker-compose.yml`
2. Chạy lệnh:

```bash
docker-compose up -d
```

3. Các dịch vụ sẽ khởi chạy:

   * **SQL Server** (port 1433)
   * **RabbitMQ** (port 5672, management UI 15672)
   * **Eventix Ticketing & Payment Service** (port 8080)

Kiểm tra log:

```bash
docker logs -f eventix
```

---

## API Endpoints chính

### 1. Đặt vé

**POST** `/api/tickets/book`

```json
{
  "eventId": 1,
  "studentId": "S12345"
}
```

Phản hồi:

```json
{
  "ticketId": 101,
  "status": "BOOKED",
  "qrCodePath": "./qrcodes/ticket-101.png"
}
```

### 2. Xử lý thanh toán

**POST** `/api/payments/process`

```json
{
  "ticketId": 101,
  "amount": 200000,
  "method": "CREDIT_CARD"
}
```

Phản hồi:

```json
{
  "paymentId": 501,
  "status": "SUCCESS",
  "message": "Payment completed"
}
```

---

## Ghi chú

* QR code được lưu trong thư mục `./qrcodes/`
* Cần chắc chắn database `Eventix` đã tồn tại trong SQL Server trước khi chạy.
* RabbitMQ được dùng để gửi thông báo sau khi thanh toán thành công.
