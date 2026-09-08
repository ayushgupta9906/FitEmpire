-- Performance optimization indexes for high-throughput turnstile check-ins and search
CREATE INDEX IF NOT EXISTS idx_bookings_user_date ON bookings(user_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_branch_slot ON bookings(branch_id, booking_date, start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_qr_token ON bookings(qr_token);
CREATE INDEX IF NOT EXISTS idx_wallets_user_active ON wallets(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_user_memberships_active ON user_memberships(user_id, status, end_date);
