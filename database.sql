create database conference;
use conference;

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL ,
  password VARCHAR(255) NOT NULL 
);

CREATE TABLE committee (
  id INT PRIMARY KEY AUTO_INCREMENT,
  committee_type VARCHAR(255),
  sub_committee VARCHAR(255),
  name VARCHAR(255),
  role VARCHAR(255),
  organization VARCHAR(255),
  country VARCHAR(255)
);	

CREATE TABLE registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  registration_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  affiliation VARCHAR(255) NOT NULL,
  designation VARCHAR(100),
  country VARCHAR(100),
  email VARCHAR(255),
  contact_number VARCHAR(50),
  participant_type VARCHAR(50),
  paper_id VARCHAR(100),
  paper_title TEXT,
  num_authors INT,
  sub_category VARCHAR(100),
  region VARCHAR(100),
  attendance_mode VARCHAR(20),
  attend_workshop VARCHAR(10),
  total_fee_usd DECIMAL(10,2),
  total_fee_inr DECIMAL(10,2),
  mode_of_payment VARCHAR(50),
  transaction_id VARCHAR(100),
  date_of_payment DATE,
  payment_proof_path VARCHAR(255),
  declaration BOOLEAN,
  qr_code LONGTEXT,
  payment_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT * FROM committee;
ALTER TABLE committee CHANGE sub_committee sub_committe VARCHAR(255);


-- Hotel Bookings Table
CREATE TABLE hotel_bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_email ON hotel_bookings(email);
CREATE INDEX idx_booking_id ON hotel_bookings(booking_id);
CREATE INDEX idx_check_in_date ON hotel_bookings(check_in_date);
