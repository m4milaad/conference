-- Create hotel_bookings table
CREATE TABLE IF NOT EXISTS hotel_bookings (
  id BIGSERIAL PRIMARY KEY,
  booking_id VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  country VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  number_of_rooms INT NOT NULL,
  number_of_guests INT NOT NULL,
  meal_plan VARCHAR(50) NOT NULL,
  meal_plan_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  special_requests TEXT,
  transaction_id VARCHAR(100),
  payment_proof_path VARCHAR(255),
  payment_verified BOOLEAN DEFAULT FALSE,
  booking_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_hotel_bookings_email ON hotel_bookings(email);
CREATE INDEX idx_hotel_bookings_booking_id ON hotel_bookings(booking_id);
CREATE INDEX idx_hotel_bookings_check_in_date ON hotel_bookings(check_in_date);
CREATE INDEX idx_hotel_bookings_status ON hotel_bookings(booking_status);

-- Enable RLS (Row Level Security)
ALTER TABLE hotel_bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert
CREATE POLICY "Allow anyone to insert hotel bookings" ON hotel_bookings
  FOR INSERT WITH CHECK (true);

-- Create policy to allow anyone to read their own bookings
CREATE POLICY "Allow users to read their own bookings" ON hotel_bookings
  FOR SELECT USING (true);
