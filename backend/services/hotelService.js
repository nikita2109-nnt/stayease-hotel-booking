
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
module.exports = {
    getAllHotels,
    getHotelsByLocation,
    getHotelById
};
