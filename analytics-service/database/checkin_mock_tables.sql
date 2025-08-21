-- Mock tables for testing real data integration
-- These simulate checkin service tables

USE eventix_analytics;

-- Event Registrations (simulating checkin service data)
CREATE TABLE IF NOT EXISTS event_registrations (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    attendee_id VARCHAR(36) NOT NULL,
    attendee_name VARCHAR(200),
    email VARCHAR(255),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED') DEFAULT 'CONFIRMED',
    INDEX idx_event_id (event_id)
);

-- Attendee Check-ins (simulating checkin service data)
CREATE TABLE IF NOT EXISTS attendee_checkins (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    attendee_id VARCHAR(36) NOT NULL,
    check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    check_out_time TIMESTAMP NULL,
    location VARCHAR(100),
    sponsor_booth_id VARCHAR(36),
    INDEX idx_event_id (event_id),
    INDEX idx_check_in_time (check_in_time)
);

-- Sponsor Booths (simulating checkin service data)
CREATE TABLE IF NOT EXISTS sponsor_booths (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    sponsor_name VARCHAR(200) NOT NULL,
    booth_location VARCHAR(100),
    contact_person VARCHAR(200),
    setup_complete BOOLEAN DEFAULT FALSE,
    INDEX idx_event_id (event_id)
);

-- Sponsor Booth Visits (simulating checkin service data)
CREATE TABLE IF NOT EXISTS sponsor_booth_visits (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    booth_id VARCHAR(36) NOT NULL,
    attendee_id VARCHAR(36) NOT NULL,
    visit_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    visit_end TIMESTAMP NULL,
    interaction_type ENUM('VISIT', 'DEMO', 'CONSULTATION', 'PRODUCT_TRIAL') DEFAULT 'VISIT',
    notes TEXT,
    INDEX idx_event_id (event_id),
    INDEX idx_booth_id (booth_id),
    INDEX idx_attendee_id (attendee_id)
);

-- Insert sample realistic data for testing
INSERT INTO event_registrations (id, event_id, attendee_id, attendee_name, email, registration_date, status) VALUES
('reg-001', 'event-001', 'att-001', 'Nguyen Van A', 'vana@email.com', '2024-01-15 09:00:00', 'CONFIRMED'),
('reg-002', 'event-001', 'att-002', 'Tran Thi B', 'thib@email.com', '2024-01-15 09:15:00', 'CONFIRMED'),
('reg-003', 'event-001', 'att-003', 'Le Van C', 'vanc@email.com', '2024-01-15 09:30:00', 'CONFIRMED'),
('reg-004', 'event-001', 'att-004', 'Pham Thi D', 'thid@email.com', '2024-01-15 10:00:00', 'CONFIRMED'),
('reg-005', 'event-001', 'att-005', 'Hoang Van E', 'vane@email.com', '2024-01-15 10:15:00', 'CONFIRMED'),
('reg-006', 'event-002', 'att-006', 'Vu Thi F', 'thif@email.com', '2024-01-16 08:00:00', 'CONFIRMED'),
('reg-007', 'event-002', 'att-007', 'Do Van G', 'vang@email.com', '2024-01-16 08:30:00', 'CONFIRMED'),
('reg-008', 'event-002', 'att-008', 'Bui Thi H', 'thih@email.com', '2024-01-16 09:00:00', 'CONFIRMED');

INSERT INTO attendee_checkins (id, event_id, attendee_id, check_in_time, check_out_time, location) VALUES
('checkin-001', 'event-001', 'att-001', '2024-01-20 08:30:00', '2024-01-20 17:30:00', 'Main Entrance'),
('checkin-002', 'event-001', 'att-002', '2024-01-20 08:45:00', '2024-01-20 17:15:00', 'Main Entrance'),
('checkin-003', 'event-001', 'att-003', '2024-01-20 09:00:00', '2024-01-20 16:45:00', 'Main Entrance'),
('checkin-004', 'event-001', 'att-004', '2024-01-20 09:15:00', NULL, 'Main Entrance'),
('checkin-005', 'event-001', 'att-005', CURRENT_TIMESTAMP, NULL, 'Main Entrance'),
('checkin-006', 'event-002', 'att-006', '2024-01-21 08:00:00', '2024-01-21 18:00:00', 'Side Entrance'),
('checkin-007', 'event-002', 'att-007', '2024-01-21 08:30:00', '2024-01-21 17:30:00', 'Side Entrance');

INSERT INTO sponsor_booths (id, event_id, sponsor_name, booth_location, contact_person, setup_complete) VALUES
('booth-001', 'event-001', 'Tech Corp Vietnam', 'Hall A - Booth 1', 'John Smith', TRUE),
('booth-002', 'event-001', 'Innovation Hub', 'Hall A - Booth 2', 'Jane Doe', TRUE),
('booth-003', 'event-001', 'Startup Alliance', 'Hall B - Booth 1', 'Bob Johnson', TRUE),
('booth-004', 'event-002', 'Digital Solutions', 'Hall C - Booth 1', 'Alice Brown', TRUE),
('booth-005', 'event-002', 'Future Tech', 'Hall C - Booth 2', 'Charlie Wilson', TRUE);

INSERT INTO sponsor_booth_visits (id, event_id, booth_id, attendee_id, visit_start, visit_end, interaction_type, notes) VALUES
('visit-001', 'event-001', 'booth-001', 'att-001', '2024-01-20 10:00:00', '2024-01-20 10:15:00', 'DEMO', 'Interested in AI solutions'),
('visit-002', 'event-001', 'booth-001', 'att-002', '2024-01-20 10:30:00', '2024-01-20 10:45:00', 'VISIT', 'General inquiry'),
('visit-003', 'event-001', 'booth-002', 'att-001', '2024-01-20 11:00:00', '2024-01-20 11:20:00', 'CONSULTATION', 'Discussed partnership'),
('visit-004', 'event-001', 'booth-002', 'att-003', '2024-01-20 11:30:00', '2024-01-20 11:45:00', 'PRODUCT_TRIAL', 'Tested new software'),
('visit-005', 'event-001', 'booth-003', 'att-002', '2024-01-20 14:00:00', '2024-01-20 14:10:00', 'VISIT', 'Collected brochures'),
('visit-006', 'event-001', 'booth-001', 'att-004', CURRENT_TIMESTAMP, NULL, 'DEMO', 'Ongoing demonstration'),
('visit-007', 'event-002', 'booth-004', 'att-006', '2024-01-21 10:00:00', '2024-01-21 10:25:00', 'CONSULTATION', 'B2B discussion'),
('visit-008', 'event-002', 'booth-005', 'att-007', '2024-01-21 15:00:00', '2024-01-21 15:30:00', 'PRODUCT_TRIAL', 'VR experience');
