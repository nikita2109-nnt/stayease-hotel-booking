
const hotelModel = require("../models/hotelModel");

// Business logic for hotels
const getAllHotels = async () => {

    const hotels = await hotelModel.getAllHotels();

    return hotels;
};
const getHotelsByLocation = async (location) => {

    const hotels = await hotelModel.getHotelsByLocation(location);

    return hotels;
};

const getHotelById = async (hotelId) => {

    const hotels = await hotelModel.getHotelById(hotelId);

    return hotels;
};


const getRoomAvailability = async (hotelId, checkIn, checkOut) => {

    const availability = await hotelModel.getRoomAvailability(
        hotelId,
        checkIn,
        checkOut
    );

    return availability;
};

module.exports = {
    getAllHotels,
    getHotelsByLocation,
    getHotelById,
    getRoomAvailability
};
