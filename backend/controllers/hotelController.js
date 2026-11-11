
const hotelService = require("../services/hotelService");

// Get all hotels
const getAllHotels = async (req, res) => {

    try {

        const hotels = await hotelService.getAllHotels();

        res.status(200).json({
            success: true,
            count: hotels.length,
            data: hotels
        });

    } catch (error) {

        console.error("Error fetching hotels:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch hotels"
        });

    }
};
const getHotelsByLocation = async (req, res) => {

    try {

        const { location } = req.query;

        if (!location || !location.trim()) {
            return res.status(400).json({
                success: false,
                message: "Location is required"
            });
        }

        const hotels = await hotelService.getHotelsByLocation(
            location.trim()
        );

        res.status(200).json({
            success: true,
            count: hotels.length,
            data: hotels
        });

    } catch (error) {

        console.error("Hotel search error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to search hotels"
        });

    }
};

const getHotelById = async (req, res) => {

    try {

        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid hotel ID"
            });
        }

        const hotels = await hotelService.getHotelById(Number(id));

        if (hotels.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }

        res.status(200).json({
            success: true,
            data: hotels
        });

    } catch (error) {

        console.error("Hotel details error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch hotel details"
        });

    }
};


const getRoomAvailability = async (req, res) => {

    try {

        const { id } = req.params;
        const { checkIn, checkOut } = req.query;

        // Validate hotel ID
        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid hotel ID"
            });
        }

        // Validate required dates
        if (!checkIn || !checkOut) {
            return res.status(400).json({
                success: false,
                message: "Check-in and check-out dates are required"
            });
        }

        // Validate YYYY-MM-DD format and actual calendar dates
        const isValidDate = (value) => {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                return false;
            }

            const date = new Date(`${value}T00:00:00Z`);

            return !Number.isNaN(date.getTime()) &&
                date.toISOString().slice(0, 10) === value;
        };

        if (!isValidDate(checkIn) || !isValidDate(checkOut)) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format. Use YYYY-MM-DD"
            });
        }

        // Check-out must be after check-in
        if (checkOut <= checkIn) {
            return res.status(400).json({
                success: false,
                message: "Check-out must be after check-in"
            });
        }

        // Check-in cannot be in the past
        const today = new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Kolkata"
        });

        if (checkIn < today) {
            return res.status(400).json({
                success: false,
                message: "Check-in date cannot be in the past"
            });
        }

        const availability = await hotelService.getRoomAvailability(
            Number(id),
            checkIn,
            checkOut
        );

        if (availability.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found or no room categories available"
            });
        }

        res.status(200).json({
            success: true,
            hotel: availability[0].hotel_name,
            checkIn,
            checkOut,
            data: availability
        });

    } catch (error) {

        console.error("Availability error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to check room availability"
        });

    }
};

module.exports = {
    getAllHotels,
    getHotelsByLocation,
    getHotelById,
    getRoomAvailability
};
