# Server
server.port=8081

# Datasource MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/identitydb?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=123456
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Spring Security (cho dev, dùng in-memory user nếu muốn)
spring.security.user.name=root
spring.security.user.password=tamnhu13
