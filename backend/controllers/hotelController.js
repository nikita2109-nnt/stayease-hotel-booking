
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

module.exports = {
    getAllHotels
};
