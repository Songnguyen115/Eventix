@echo off
echo Starting Analytics Service with Simple Docker Setup...
echo.

echo Stopping existing containers...
docker-compose -f docker-compose.simple.yml down

echo.
echo Building and starting service...
docker-compose -f docker-compose.simple.yml up --build -d

echo.
echo Waiting for service to be ready...
timeout /t 5 /nobreak > nul

echo.
echo Service status:
docker-compose -f docker-compose.simple.yml ps

echo.
echo Testing API...
curl http://localhost:3003/health

echo.
echo Service ready at: http://localhost:3003
echo Health Check: http://localhost:3003/health
echo Analytics API: http://localhost:3003/api/v1/analytics

echo.
echo To view logs: docker-compose -f docker-compose.simple.yml logs -f
echo To stop: docker-compose -f docker-compose.simple.yml down
