CREATE DATABASE IF NOT EXISTS stayease_db;

USE stayease_db;

CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(150) NOT NULL,
    description TEXT,
    amenities JSON,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_hotel_location (location)
);

CREATE TABLE room_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT NOT NULL,
    room_name VARCHAR(100) NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    total_rooms INT NOT NULL,

    CONSTRAINT fk_room_hotel
        FOREIGN KEY (hotel_id)
        REFERENCES hotels(id),

    CONSTRAINT chk_room_price
        CHECK (price_per_night > 0),

    CONSTRAINT chk_total_rooms
        CHECK (total_rooms > 0),

    UNIQUE KEY uq_hotel_room (hotel_id, room_name)
);

CREATE TABLE coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_by INT NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),

    discount_type ENUM('PERCENTAGE', 'FIXED') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    max_discount DECIMAL(10,2) DEFAULT NULL,
    min_booking_amount DECIMAL(10,2) DEFAULT 0,

    usage_limit INT NOT NULL,
    usage_count INT NOT NULL DEFAULT 0,

    start_date DATETIME NOT NULL,
    expiry_date DATETIME NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_coupon_admin
        FOREIGN KEY (created_by)
        REFERENCES admins(id),

    CONSTRAINT chk_discount_value
        CHECK (discount_value > 0),

    CONSTRAINT chk_coupon_usage
        CHECK (
            usage_limit > 0
            AND usage_count >= 0
            AND usage_count <= usage_limit
        ),

    CONSTRAINT chk_coupon_dates
        CHECK (expiry_date > start_date),

    CONSTRAINT chk_min_booking
        CHECK (min_booking_amount >= 0),

    CONSTRAINT chk_max_discount
        CHECK (max_discount IS NULL OR max_discount > 0),

    CONSTRAINT chk_percentage
        CHECK (
            discount_type <> 'PERCENTAGE'
            OR discount_value <= 100
        )
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,

    booking_reference VARCHAR(30) NOT NULL UNIQUE,
    room_type_id INT NOT NULL,

    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,

    check_in DATE NOT NULL,
    check_out DATE NOT NULL,

    total_nights INT NOT NULL,

    subtotal DECIMAL(10,2) NOT NULL,

    coupon_id INT DEFAULT NULL,
    coupon_code_snapshot VARCHAR(50) DEFAULT NULL,
    discount_type_snapshot ENUM('PERCENTAGE', 'FIXED') DEFAULT NULL,
    discount_value_snapshot DECIMAL(10,2) DEFAULT NULL,

    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,

    status ENUM('CONFIRMED', 'CANCELLED')
        NOT NULL DEFAULT 'CONFIRMED',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_booking_room
        FOREIGN KEY (room_type_id)
        REFERENCES room_types(id),

    CONSTRAINT fk_booking_coupon
        FOREIGN KEY (coupon_id)
        REFERENCES coupons(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_booking_dates
        CHECK (check_out > check_in),

    CONSTRAINT chk_booking_nights
        CHECK (total_nights > 0),

    CONSTRAINT chk_booking_amounts
        CHECK (
            subtotal > 0
            AND discount_amount >= 0
            AND discount_amount <= subtotal
            AND final_amount = subtotal - discount_amount
        ),

    INDEX idx_booking_room_dates
        (room_type_id, status, check_in, check_out),

    INDEX idx_booking_customer
        (booking_reference, customer_email)
);

CREATE TABLE coupon_usages (
    id INT AUTO_INCREMENT PRIMARY KEY,

    coupon_id INT NOT NULL,
    booking_id INT NOT NULL UNIQUE,

    status ENUM('REDEEMED', 'RELEASED')
        NOT NULL DEFAULT 'REDEEMED',

    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    released_at TIMESTAMP NULL DEFAULT NULL,

    CONSTRAINT fk_usage_coupon
        FOREIGN KEY (coupon_id)
        REFERENCES coupons(id),

    CONSTRAINT fk_usage_booking
        FOREIGN KEY (booking_id)
        REFERENCES bookings(id),

    INDEX idx_coupon_usage (coupon_id, status)
);