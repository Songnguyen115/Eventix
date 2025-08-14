-- Eventix Check-in Service Database Schema

-- Create database if not exists
-- CREATE DATABASE eventix_checkin;

-- Use the database
-- \c eventix_checkin;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(500) NOT NULL,
    max_attendees INTEGER NOT NULL DEFAULT 0,
    current_attendees INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    organizer_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendees table
CREATE TABLE attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    ticket_id UUID NOT NULL,
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL DEFAULT 'REGISTERED',
    qr_code VARCHAR(255) NOT NULL UNIQUE,
    sponsor_booth_visits JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sponsor booths table
CREATE TABLE sponsor_booths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    sponsor_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(500) NOT NULL,
    qr_code VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    visitor_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Booth visitors table
CREATE TABLE booth_visitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booth_id UUID NOT NULL REFERENCES sponsor_booths(id) ON DELETE CASCADE,
    attendee_id UUID NOT NULL REFERENCES attendees(id) ON DELETE CASCADE,
    visit_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration INTEGER NOT NULL DEFAULT 0, -- in minutes
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (for authentication)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'GUEST',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendees_updated_at BEFORE UPDATE ON attendees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sponsor_booths_updated_at BEFORE UPDATE ON sponsor_booths
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO users (id, email, password_hash, role, first_name, last_name) VALUES
    (uuid_generate_v4(), 'admin@eventix.com', '$2b$10$example.hash', 'ADMIN', 'Admin', 'User'),
    (uuid_generate_v4(), 'sponsor@eventix.com', '$2b$10$example.hash', 'SPONSOR', 'Sponsor', 'User'),
    (uuid_generate_v4(), 'staff@eventix.com', '$2b$10$example.hash', 'STAFF', 'Staff', 'User');

-- Insert sample event
INSERT INTO events (id, name, description, start_date, end_date, location, max_attendees, organizer_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'FU Business Seminar 2024', 'Annual business seminar for FU students', 
     '2024-03-15 09:00:00+07', '2024-03-15 17:00:00+07', 'FU Main Campus', 500, 
     (SELECT id FROM users WHERE email = 'admin@eventix.com' LIMIT 1));

-- Insert sample attendees for testing
INSERT INTO attendees (event_id, user_id, ticket_id, status, qr_code) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', uuid_generate_v4(), uuid_generate_v4(), 'REGISTERED', 'event-demo-2024:attendee-123'),
    ('550e8400-e29b-41d4-a716-446655440000', uuid_generate_v4(), uuid_generate_v4(), 'REGISTERED', 'event-demo-2024:john-doe'),
    ('550e8400-e29b-41d4-a716-446655440000', uuid_generate_v4(), uuid_generate_v4(), 'REGISTERED', 'event-demo-2024:jane-smith'),
    ('550e8400-e29b-41d4-a716-446655440000', uuid_generate_v4(), uuid_generate_v4(), 'CHECKED_IN', 'event-demo-2024:mike-johnson');
