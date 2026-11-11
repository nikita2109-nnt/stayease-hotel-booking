
USE stayease_db;

-- Insert sample hotels
INSERT INTO hotels
(name, location, description, amenities, image_url)
VALUES

(
    'Grand Palace Hotel',
    'Mumbai, Maharashtra',
    'A comfortable luxury hotel located in the heart of Mumbai.',
    JSON_ARRAY('Free Wi-Fi', 'Swimming Pool', 'Parking', 'AC'),
    'https://example.com/grand-palace.jpg'
),

(
    'Royal Orchid Stay',
    'Pune, Maharashtra',
    'A modern hotel offering comfortable accommodation in Pune.',
    JSON_ARRAY('Free Wi-Fi', 'Restaurant', 'Parking', 'AC'),
    'https://example.com/royal-orchid.jpg'
),

(
    'Ocean Breeze Resort',
    'Goa',
    'A beautiful beachside resort offering a relaxing holiday experience.',
    JSON_ARRAY('Swimming Pool', 'Beach Access', 'Free Wi-Fi', 'Restaurant'),
    'https://example.com/ocean-breeze.jpg'
),

(
    'Heritage Palace',
    'Jaipur, Rajasthan',
    'A heritage-inspired hotel showcasing traditional Rajasthani hospitality.',
    JSON_ARRAY('Free Wi-Fi', 'Restaurant', 'Parking', 'Room Service'),
    'https://example.com/heritage-palace.jpg'
),

(
    'City Comfort Inn',
    'New Delhi',
    'An affordable hotel providing comfortable accommodation for travellers.',
    JSON_ARRAY('Free Wi-Fi', 'AC', 'Parking', 'Breakfast'),
    'https://example.com/city-comfort.jpg'
);


-- Insert room categories
INSERT INTO room_types
(hotel_id, room_name, price_per_night, total_rooms)
VALUES

(
    (SELECT id FROM hotels WHERE name = 'Grand Palace Hotel'),
    'Deluxe Room',
    3000.00,
    5
),

(
    (SELECT id FROM hotels WHERE name = 'Royal Orchid Stay'),
    'Standard Room',
    2500.00,
    8
),

(
    (SELECT id FROM hotels WHERE name = 'Ocean Breeze Resort'),
    'Premium Room',
    4500.00,
    6
),

(
    (SELECT id FROM hotels WHERE name = 'Heritage Palace'),
    'Royal Room',
    3500.00,
    4
),

(
    (SELECT id FROM hotels WHERE name = 'City Comfort Inn'),
    'Standard Room',
    2000.00,
    10
);
