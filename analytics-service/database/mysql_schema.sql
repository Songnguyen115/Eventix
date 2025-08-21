-- Eventix Analytics Service Database Schema
-- This service handles reporting, dashboard metrics, and survey management

USE eventix_analytics;

-- Analytics Events Table - Tracks all analytics events
CREATE TABLE analytics_events (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    event_type ENUM('PAGE_VIEW', 'BUTTON_CLICK', 'FORM_SUBMIT', 'API_CALL', 'ERROR') NOT NULL,
    user_id VARCHAR(36),
    session_id VARCHAR(36),
    metadata JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_event_id (event_id),
    INDEX idx_user_id (user_id),
    INDEX idx_timestamp (timestamp)
);

-- Dashboard Metrics Table - Stores pre-calculated metrics for dashboard
CREATE TABLE dashboard_metrics (
    id VARCHAR(36) PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,2) NOT NULL,
    metric_unit VARCHAR(50),
    event_id VARCHAR(36),
    category VARCHAR(100),
    period VARCHAR(50), -- daily, weekly, monthly, yearly
    period_start TIMESTAMP,
    period_end TIMESTAMP,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_metric_name (metric_name),
    INDEX idx_event_id (event_id),
    INDEX idx_period (period)
);

-- Reports Table - Stores generated reports
CREATE TABLE reports (
    id VARCHAR(36) PRIMARY KEY,
    report_name VARCHAR(200) NOT NULL,
    report_type ENUM('ATTENDANCE', 'REVENUE', 'SURVEY', 'SPONSOR', 'CUSTOM') NOT NULL,
    event_id VARCHAR(36),
    generated_by VARCHAR(36),
    file_path VARCHAR(500),
    report_data JSON,
    status ENUM('PENDING', 'GENERATING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    INDEX idx_report_type (report_type),
    INDEX idx_event_id (event_id),
    INDEX idx_status (status)
);

-- Surveys Table - Manages survey creation and distribution
CREATE TABLE surveys (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_id VARCHAR(36),
    survey_type ENUM('POST_EVENT', 'SPONSOR_FEEDBACK', 'GENERAL_FEEDBACK') NOT NULL,
    status ENUM('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED') DEFAULT 'DRAFT',
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_event_id (event_id),
    INDEX idx_status (status),
    INDEX idx_survey_type (survey_type)
);

-- Survey Questions Table
CREATE TABLE survey_questions (
    id VARCHAR(36) PRIMARY KEY,
    survey_id VARCHAR(36) NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('MULTIPLE_CHOICE', 'SINGLE_CHOICE', 'TEXT', 'RATING', 'SCALE') NOT NULL,
    options JSON, -- For multiple choice questions
    required BOOLEAN DEFAULT FALSE,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE,
    INDEX idx_survey_id (survey_id),
    INDEX idx_order_index (order_index)
);

-- Survey Responses Table
CREATE TABLE survey_responses (
    id VARCHAR(36) PRIMARY KEY,
    survey_id VARCHAR(36) NOT NULL,
    question_id VARCHAR(36) NOT NULL,
    attendee_id VARCHAR(36),
    user_id VARCHAR(36),
    response_value TEXT,
    response_metadata JSON,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES survey_questions(id) ON DELETE CASCADE,
    INDEX idx_survey_id (survey_id),
    INDEX idx_question_id (question_id),
    INDEX idx_attendee_id (attendee_id)
);

-- Survey Distribution Table - Tracks survey invitations and responses
CREATE TABLE survey_distribution (
    id VARCHAR(36) PRIMARY KEY,
    survey_id VARCHAR(36) NOT NULL,
    attendee_id VARCHAR(36),
    user_id VARCHAR(36),
    email VARCHAR(255),
    status ENUM('PENDING', 'SENT', 'OPENED', 'COMPLETED', 'BOUNCED') DEFAULT 'PENDING',
    sent_at TIMESTAMP,
    opened_at TIMESTAMP,
    completed_at TIMESTAMP,
    reminder_count INT DEFAULT 0,
    last_reminder_sent TIMESTAMP,
    FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE,
    INDEX idx_survey_id (survey_id),
    INDEX idx_status (status),
    INDEX idx_email (email)
);

-- Event Analytics Summary Table - Aggregated data for quick dashboard access
CREATE TABLE event_analytics_summary (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    total_registrations INT DEFAULT 0,
    total_checkins INT DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0.00,
    average_rating DECIMAL(3,2),
    total_survey_responses INT DEFAULT 0,
    sponsor_booth_visits INT DEFAULT 0,
    peak_attendance_time TIME,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_event (event_id),
    INDEX idx_event_id (event_id)
);

-- External Service Data Cache - Caches data from other microservices
CREATE TABLE external_service_cache (
    id VARCHAR(36) PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    endpoint VARCHAR(200) NOT NULL,
    cache_key VARCHAR(255) NOT NULL,
    cache_data JSON,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_service_name (service_name),
    INDEX idx_cache_key (cache_key),
    INDEX idx_expires_at (expires_at)
);

-- Message Queue Logs - Tracks inter-service communication
CREATE TABLE message_queue_logs (
    id VARCHAR(36) PRIMARY KEY,
    queue_name VARCHAR(100) NOT NULL,
    message_type VARCHAR(100) NOT NULL,
    message_data JSON,
    status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
    processing_time_ms INT,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    INDEX idx_queue_name (queue_name),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Insert sample data for testing
INSERT INTO event_analytics_summary (id, event_id, total_registrations, total_checkins, total_revenue, average_rating, total_survey_responses, sponsor_booth_visits) VALUES
('sample-1', 'event-001', 150, 120, 15000.00, 4.5, 85, 45),
('sample-2', 'event-002', 200, 180, 25000.00, 4.8, 120, 60);

-- Create views for common analytics queries
CREATE VIEW daily_metrics AS
SELECT 
    DATE(timestamp) as date,
    COUNT(*) as total_events,
    COUNT(CASE WHEN event_type = 'API_CALL' THEN 1 END) as api_calls,
    COUNT(CASE WHEN event_type = 'PAGE_VIEW' THEN 1 END) as page_views
FROM analytics_events 
WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(timestamp);

CREATE VIEW survey_response_summary AS
SELECT 
    s.title as survey_title,
    COUNT(DISTINCT sr.attendee_id) as total_respondents,
    COUNT(sr.id) as total_responses,
    AVG(CASE WHEN sq.question_type = 'RATING' THEN CAST(sr.response_value AS DECIMAL(3,2)) END) as average_rating
FROM surveys s
LEFT JOIN survey_responses sr ON s.id = sr.survey_id
LEFT JOIN survey_questions sq ON sr.question_id = sq.id
GROUP BY s.id, s.title;
