
const hotelModel = require("../models/hotelModel");

// Business logic for hotels
const getAllHotels = async () => {

    const hotels = await hotelModel.getAllHotels();

    return hotels;
};

module.exports = {
    getAllHotels
};
