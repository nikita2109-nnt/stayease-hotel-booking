
const pool = require("../config/db");

// Get all hotels with their room details
const getAllHotels = async () => {

    const [rows] = await pool.query(`
        SELECT
            h.id AS hotel_id,
            h.name AS hotel_name,
            h.location,
            h.description,
            h.amenities,
            h.image_url,

            r.id AS room_type_id,
            r.room_name,
            r.price_per_night,
            r.total_rooms

        FROM hotels h

        LEFT JOIN room_types r
        ON h.id = r.hotel_id

        ORDER BY h.id;
    `);

    return rows;
};




const getHotelsByLocation = async (location) => {

    const searchValue = `%${location}%`;

    const [rows] = await pool.execute(
        `SELECT
            h.id AS hotel_id,
            h.name AS hotel_name,
            h.location,
            h.description,
            h.amenities,
            h.image_url,
            r.id AS room_type_id,
            r.room_name,
            r.price_per_night,
            r.total_rooms

        FROM hotels h

        LEFT JOIN room_types r
        ON h.id = r.hotel_id

        WHERE h.location LIKE ?

        ORDER BY h.id`,
        [searchValue]
    );

    return rows;
};


const getHotelById = async (hotelId) => {

    const [rows] = await pool.execute(
        `SELECT
            h.id AS hotel_id,
            h.name AS hotel_name,
            h.location,
            h.description,
            h.amenities,
            h.image_url,
            r.id AS room_type_id,
            r.room_name,
            r.price_per_night,
            r.total_rooms

        FROM hotels h

        LEFT JOIN room_types r
        ON h.id = r.hotel_id

        WHERE h.id = ?
        ORDER BY r.id`,
        [hotelId]
    );

    return rows;
};

module.exports = {
    getAllHotels,
    getHotelsByLocation,
     getHotelById
};