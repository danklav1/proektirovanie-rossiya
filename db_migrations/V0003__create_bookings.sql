CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT '',
    address TEXT NOT NULL DEFAULT '',
    service TEXT NOT NULL DEFAULT '',
    slot_date DATE NOT NULL,
    slot_time TEXT NOT NULL,
    comment TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new'
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_slot ON bookings (city, slot_date, slot_time);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings (slot_date);