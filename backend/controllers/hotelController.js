
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
module.exports = {
    getAllHotels,
    getHotelsByLocation,
    getHotelById
};
