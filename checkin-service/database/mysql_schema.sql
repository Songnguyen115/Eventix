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
