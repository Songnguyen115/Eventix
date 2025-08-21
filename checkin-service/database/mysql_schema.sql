-- Eventix Check-in Service MySQL Database Schema

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS eventix_checkin;
USE eventix_checkin;

-- Events table
CREATE TABLE events (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    location VARCHAR(500) NOT NULL,
    max_attendees INT NOT NULL DEFAULT 0,
    current_attendees INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    organizer_id VARCHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users table (for authentication)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'GUEST',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Attendees table
CREATE TABLE attendees (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    event_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    ticket_id VARCHAR(36) NOT NULL,
    check_in_time DATETIME NULL,
    check_out_time DATETIME NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'REGISTERED',
    qr_code VARCHAR(255) NOT NULL UNIQUE,
    sponsor_booth_visits JSON DEFAULT ('[]'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Sponsor booths table
CREATE TABLE sponsor_booths (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    event_id VARCHAR(36) NOT NULL,
    sponsor_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(500) NOT NULL,
    qr_code VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    visitor_count INT NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Booth visitors table
CREATE TABLE booth_visitors (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    booth_id VARCHAR(36) NOT NULL,
    attendee_id VARCHAR(36) NOT NULL,
    visit_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    duration INT NOT NULL DEFAULT 0, -- in minutes
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booth_id) REFERENCES sponsor_booths(id) ON DELETE CASCADE,
    FOREIGN KEY (attendee_id) REFERENCES attendees(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_attendees_event_id ON attendees(event_id);
CREATE INDEX idx_attendees_user_id ON attendees(user_id);
CREATE INDEX idx_attendees_ticket_id ON attendees(ticket_id);
CREATE INDEX idx_attendees_qr_code ON attendees(qr_code);
CREATE INDEX idx_attendees_status ON attendees(status);
CREATE INDEX idx_attendees_check_in_time ON attendees(check_in_time);

CREATE INDEX idx_sponsor_booths_event_id ON sponsor_booths(event_id);
CREATE INDEX idx_sponsor_booths_sponsor_id ON sponsor_booths(sponsor_id);
CREATE INDEX idx_sponsor_booths_qr_code ON sponsor_booths(qr_code);

CREATE INDEX idx_booth_visitors_booth_id ON booth_visitors(booth_id);
CREATE INDEX idx_booth_visitors_attendee_id ON booth_visitors(attendee_id);
CREATE INDEX idx_booth_visitors_visit_time ON booth_visitors(visit_time);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Insert sample data for testing
INSERT INTO users (id, email, password_hash, role, first_name, last_name) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'admin@eventix.com', '$2b$10$example.hash', 'ADMIN', 'Admin', 'User'),
    ('550e8400-e29b-41d4-a716-446655440002', 'sponsor@eventix.com', '$2b$10$example.hash', 'SPONSOR', 'Sponsor', 'User'),
    ('550e8400-e29b-41d4-a716-446655440003', 'staff@eventix.com', '$2b$10$example.hash', 'STAFF', 'Staff', 'User');

-- Insert sample events
INSERT INTO events (id, name, description, start_date, end_date, location, max_attendees, organizer_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'FU Business Seminar 2024', 'Annual business seminar for FU students', 
     '2024-03-15 09:00:00', '2024-03-15 17:00:00', 'FU Main Campus', 500, 
     '550e8400-e29b-41d4-a716-446655440001'),
    ('550e8400-e29b-41d4-a716-446655440100', 'UTH Tech Innovation Conference 2024', 'Hoi nghi Cong nghe va Doi moi Sang tao - Truong Dai hoc Giao thong Van tai TP.HCM', 
     '2024-04-20 08:30:00', '2024-04-20 17:30:00', 'UTH Campus - Auditorium A', 300, 
     '550e8400-e29b-41d4-a716-446655440001'),
    ('550e8400-e29b-41d4-a716-446655440101', 'UTH Career Fair 2024', 'Ngay hoi viec lam - Ket noi sinh vien UTH voi doanh nghiep', 
     '2024-05-10 09:00:00', '2024-05-10 16:00:00', 'UTH Campus - Main Hall', 800, 
     '550e8400-e29b-41d4-a716-446655440002');

-- Insert sample attendees for testing
INSERT INTO attendees (id, event_id, user_id, ticket_id, status, qr_code) VALUES
    -- FU Business Seminar attendees
    ('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440020', 'REGISTERED', 'event-demo-2024:attendee-123'),
    ('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440021', 'REGISTERED', 'event-demo-2024:john-doe'),
    ('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440022', 'REGISTERED', 'event-demo-2024:jane-smith'),
    ('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440023', 'CHECKED_IN', 'event-demo-2024:mike-johnson'),
    
    -- UTH Tech Innovation Conference attendees
    ('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440100', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440040', 'REGISTERED', 'uth-tech-2024:nguyen-van-a'),
    ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440100', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440041', 'REGISTERED', 'uth-tech-2024:tran-thi-b'),
    ('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440100', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440042', 'CHECKED_IN', 'uth-tech-2024:le-minh-c'),
    
    -- UTH Career Fair attendees
    ('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440060', 'REGISTERED', 'uth-career-2024:pham-duc-d'),
    ('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440061', 'REGISTERED', 'uth-career-2024:hoang-thi-e'),
    ('550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440062', 'REGISTERED', 'uth-career-2024:vo-van-f'),
    ('550e8400-e29b-41d4-a716-446655440053', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440063', 'CHECKED_IN', 'uth-career-2024:dao-minh-g');

-- ===============================================================
-- ANALYTICS SERVICE SCHEMA - Added for Analytics & Reporting
-- ===============================================================

-- Analytics Events Table - Tracks all analytics events
CREATE TABLE analytics_events (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    event_id VARCHAR(36) NOT NULL,
    event_type ENUM('PAGE_VIEW', 'BUTTON_CLICK', 'FORM_SUBMIT', 'API_CALL', 'ERROR', 'CHECK_IN', 'CHECK_OUT', 'SPONSOR_VISIT') NOT NULL,
    user_id VARCHAR(36),
    attendee_id VARCHAR(36),
    session_id VARCHAR(36),
    metadata JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_event_id (event_id),
    INDEX idx_user_id (user_id),
    INDEX idx_attendee_id (attendee_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_event_type (event_type),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (attendee_id) REFERENCES attendees(id) ON DELETE SET NULL
);

-- Dashboard Metrics Table - Stores pre-calculated metrics for dashboard
CREATE TABLE dashboard_metrics (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
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
    INDEX idx_period (period),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Reports Table - Stores generated reports
CREATE TABLE reports (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    report_name VARCHAR(200) NOT NULL,
    report_type ENUM('ATTENDANCE', 'REVENUE', 'SURVEY', 'SPONSOR', 'CUSTOM', 'CHECK_IN_SUMMARY', 'EVENT_ANALYTICS') NOT NULL,
    event_id VARCHAR(36),
    generated_by VARCHAR(36),
    file_path VARCHAR(500),
    report_data JSON,
    status ENUM('PENDING', 'GENERATING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    INDEX idx_report_type (report_type),
    INDEX idx_event_id (event_id),
    INDEX idx_status (status),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Surveys Table - Manages surveys for events
CREATE TABLE surveys (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_id VARCHAR(36),
    created_by VARCHAR(36),
    survey_type ENUM('FEEDBACK', 'EVALUATION', 'SATISFACTION', 'CUSTOM') DEFAULT 'FEEDBACK',
    distribution_type ENUM('EMAIL', 'ATTENDEE', 'USER') DEFAULT 'ATTENDEE',
    is_active BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_event_id (event_id),
    INDEX idx_is_active (is_active),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Survey Questions Table
CREATE TABLE survey_questions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    survey_id VARCHAR(36) NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('MULTIPLE_CHOICE', 'SINGLE_CHOICE', 'TEXT', 'RATING', 'SCALE') NOT NULL,
    options JSON, -- For multiple choice questions
    is_required BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_survey_id (survey_id),
    INDEX idx_display_order (display_order),
    FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE
);

-- Survey Responses Table
CREATE TABLE survey_responses (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    survey_id VARCHAR(36) NOT NULL,
    question_id VARCHAR(36) NOT NULL,
    attendee_id VARCHAR(36),
    user_id VARCHAR(36),
    response_value TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_survey_id (survey_id),
    INDEX idx_question_id (question_id),
    INDEX idx_attendee_id (attendee_id),
    FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES survey_questions(id) ON DELETE CASCADE,
    FOREIGN KEY (attendee_id) REFERENCES attendees(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Survey Distribution Table - Tracks survey distribution
CREATE TABLE survey_distribution (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    survey_id VARCHAR(36) NOT NULL,
    target_type ENUM('EMAIL', 'ATTENDEE', 'USER') NOT NULL,
    target_id VARCHAR(36), -- attendee_id or user_id
    email VARCHAR(255),
    status ENUM('PENDING', 'SENT', 'OPENED', 'RESPONDED', 'FAILED') DEFAULT 'PENDING',
    sent_at TIMESTAMP,
    opened_at TIMESTAMP,
    responded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_survey_id (survey_id),
    INDEX idx_target_type (target_type),
    INDEX idx_status (status),
    FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE
);

-- Event Analytics Summary Table - Pre-calculated analytics for events
CREATE TABLE event_analytics_summary (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    event_id VARCHAR(36) NOT NULL UNIQUE,
    total_registrations INT DEFAULT 0,
    total_checkins INT DEFAULT 0,
    total_checkouts INT DEFAULT 0,
    checkin_rate DECIMAL(5,2) DEFAULT 0.00, -- percentage
    total_revenue DECIMAL(15,2) DEFAULT 0.00,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_survey_responses INT DEFAULT 0,
    sponsor_booth_visits INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_event_id (event_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Create views for common analytics queries
CREATE VIEW daily_check_in_metrics AS
SELECT 
    DATE(check_in_time) as date,
    event_id,
    COUNT(*) as total_checkins,
    COUNT(DISTINCT user_id) as unique_attendees
FROM attendees 
WHERE check_in_time IS NOT NULL
GROUP BY DATE(check_in_time), event_id;

CREATE VIEW event_performance_summary AS
SELECT 
    e.id as event_id,
    e.name as event_name,
    e.max_attendees,
    COUNT(a.id) as total_registrations,
    COUNT(CASE WHEN a.status = 'CHECKED_IN' THEN 1 END) as total_checkins,
    ROUND((COUNT(CASE WHEN a.status = 'CHECKED_IN' THEN 1 END) / COUNT(a.id)) * 100, 2) as checkin_rate
FROM events e
LEFT JOIN attendees a ON e.id = a.event_id
GROUP BY e.id, e.name, e.max_attendees;

-- Insert sample analytics data
INSERT INTO analytics_events (id, event_id, event_type, user_id, attendee_id, metadata) VALUES
('analytics-001', '550e8400-e29b-41d4-a716-446655440000', 'CHECK_IN', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440013', '{"location": "entrance", "scanner_id": "scan-01"}'),
('analytics-002', '550e8400-e29b-41d4-a716-446655440100', 'PAGE_VIEW', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440032', '{"page": "event-dashboard", "user_agent": "Chrome"}'),
('analytics-003', '550e8400-e29b-41d4-a716-446655440101', 'SPONSOR_VISIT', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440053', '{"sponsor": "TechCorp", "booth_id": "booth-01"}');

-- Insert sample dashboard metrics
INSERT INTO dashboard_metrics (id, metric_name, metric_value, metric_unit, event_id, category, period) VALUES
('metric-001', 'Total Check-ins', 150, 'count', '550e8400-e29b-41d4-a716-446655440000', 'attendance', 'daily'),
('metric-002', 'Average Rating', 4.5, 'rating', '550e8400-e29b-41d4-a716-446655440100', 'feedback', 'weekly'),
('metric-003', 'Revenue Generated', 25000.00, 'VND', '550e8400-e29b-41d4-a716-446655440101', 'financial', 'monthly');

-- Insert sample event analytics summary
INSERT INTO event_analytics_summary (id, event_id, total_registrations, total_checkins, checkin_rate, total_revenue, average_rating) VALUES
('summary-001', '550e8400-e29b-41d4-a716-446655440000', 4, 1, 25.00, 0.00, 4.5),
('summary-002', '550e8400-e29b-41d4-a716-446655440100', 3, 1, 33.33, 0.00, 4.8),
('summary-003', '550e8400-e29b-41d4-a716-446655440101', 4, 1, 25.00, 0.00, 4.2);
