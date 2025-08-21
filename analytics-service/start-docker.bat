@echo off
echo Starting Eventix Analytics Service with Docker...
echo.

echo Stopping existing containers...
docker-compose down

echo.
echo Building and starting containers...
docker-compose up --build -d

echo.
echo Waiting for services to be ready...
timeout /t 10 /nobreak > nul

echo.
echo Services status:
docker-compose ps

echo.
echo Service URLs:
echo Health Check: http://localhost:3003/health
echo Analytics API: http://localhost:3003/api/v1/analytics
echo MySQL: localhost:3307
echo Redis: localhost:6380
echo RabbitMQ Management: http://localhost:15672 (user: eventix, pass: password)

echo.
echo To view logs: docker-compose logs -f analytics-service
echo To stop: docker-compose down
