-- Sample data for Payment Service
-- This file will be automatically loaded by Spring Boot on startup

-- Insert sample payments (H2 compatible format)
INSERT INTO payments (ticket_id, student_id, amount, payment_method, status, transaction_id, payment_date, created_at, description) VALUES
(1001, 10001, 150000.00, 'BANK_TRANSFER', 'SUCCESS', 'TXN_1701234567_ABC12345', TIMESTAMP '2024-01-15 10:30:00', TIMESTAMP '2024-01-15 10:25:00', 'Payment for Spring Boot Workshop');

INSERT INTO payments (ticket_id, student_id, amount, payment_method, status, transaction_id, payment_date, created_at, description) VALUES
(1002, 10002, 200000.00, 'MOMO', 'SUCCESS', 'TXN_1701234568_DEF67890', TIMESTAMP '2024-01-16 14:20:00', TIMESTAMP '2024-01-16 14:15:00', 'Payment for React Conference');

INSERT INTO payments (ticket_id, student_id, amount, payment_method, status, transaction_id, payment_date, created_at, description) VALUES
(1003, 10003, 100000.00, 'VNPAY', 'SUCCESS', 'TXN_1701234569_GHI13579', TIMESTAMP '2024-01-17 09:45:00', TIMESTAMP '2024-01-17 09:40:00', 'Payment for AI Seminar');

INSERT INTO payments (ticket_id, student_id, amount, payment_method, status, transaction_id, payment_date, created_at, description) VALUES
(1004, 10004, 175000.00, 'CREDIT_CARD', 'PENDING', 'TXN_1701234570_JKL24680', TIMESTAMP '2024-01-18 16:10:00', TIMESTAMP '2024-01-18 16:05:00', 'Payment for DevOps Training');

INSERT INTO payments (ticket_id, student_id, amount, payment_method, status, transaction_id, payment_date, created_at, description) VALUES
(1005, 10005, 250000.00, 'BANK_TRANSFER', 'SUCCESS', 'TXN_1701234571_MNO97531', TIMESTAMP '2024-01-19 11:30:00', TIMESTAMP '2024-01-19 11:25:00', 'Payment for Full Stack Course');

INSERT INTO payments (ticket_id, student_id, amount, payment_method, status, transaction_id, payment_date, created_at, description) VALUES
(1006, 10006, 120000.00, 'MOMO', 'FAILED', 'TXN_1701234572_PQR86420', TIMESTAMP '2024-01-20 13:15:00', TIMESTAMP '2024-01-20 13:10:00', 'Payment for Mobile Development');

INSERT INTO payments (ticket_id, student_id, amount, payment_method, status, transaction_id, payment_date, created_at, description) VALUES
(1007, 10007, 180000.00, 'ZALO_PAY', 'SUCCESS', 'TXN_1701234573_STU75319', TIMESTAMP '2024-01-21 15:45:00', TIMESTAMP '2024-01-21 15:40:00', 'Payment for Cloud Computing');

INSERT INTO payments (ticket_id, student_id, amount, payment_method, status, transaction_id, payment_date, created_at, description) VALUES
(1008, 10008, 300000.00, 'VNPAY', 'SUCCESS', 'TXN_1701234574_VWX64208', TIMESTAMP '2024-01-22 08:20:00', TIMESTAMP '2024-01-22 08:15:00', 'Payment for Data Science Workshop');

INSERT INTO payments (ticket_id, student_id, amount, payment_method, status, transaction_id, payment_date, created_at, description) VALUES
(1009, 10009, 90000.00, 'BANK_TRANSFER', 'CANCELLED', 'TXN_1701234575_YZA53197', TIMESTAMP '2024-01-23 12:00:00', TIMESTAMP '2024-01-23 11:55:00', 'Payment for UI/UX Design');

INSERT INTO payments (ticket_id, student_id, amount, payment_method, status, transaction_id, payment_date, created_at, description) VALUES
(1010, 10010, 220000.00, 'CREDIT_CARD', 'SUCCESS', 'TXN_1701234576_BCD42086', TIMESTAMP '2024-01-24 17:30:00', TIMESTAMP '2024-01-24 17:25:00', 'Payment for Cybersecurity Course');

-- Insert some recent payments (for testing recent payments endpoint)
INSERT INTO payments (ticket_id, student_id, amount, payment_method, status, transaction_id, payment_date, created_at, description) VALUES
(2001, 20001, 160000.00, 'MOMO', 'SUCCESS', 'TXN_2025_RECENT01', CURRENT_TIMESTAMP - INTERVAL '5' DAY, CURRENT_TIMESTAMP - INTERVAL '5' DAY, 'Recent Payment - Blockchain Workshop');

INSERT INTO payments (ticket_id, student_id, amount, payment_method, status, transaction_id, payment_date, created_at, description) VALUES
(2002, 20002, 140000.00, 'VNPAY', 'SUCCESS', 'TXN_2025_RECENT02', CURRENT_TIMESTAMP - INTERVAL '3' DAY, CURRENT_TIMESTAMP - INTERVAL '3' DAY, 'Recent Payment - Machine Learning');

INSERT INTO payments (ticket_id, student_id, amount, payment_method, status, transaction_id, payment_date, created_at, description) VALUES
(2003, 20003, 190000.00, 'BANK_TRANSFER', 'PENDING', 'TXN_2025_RECENT03', CURRENT_TIMESTAMP - INTERVAL '1' DAY, CURRENT_TIMESTAMP - INTERVAL '1' DAY, 'Recent Payment - IoT Development');
