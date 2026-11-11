
const express = require("express");

const router = express.Router();

const hotelController = require("../controllers/hotelController");

// Search hotels
router.get("/search", hotelController.getHotelsByLocation);

// Get all hotels
router.get("/", hotelController.getAllHotels);

// Check room availability
router.get("/:id/availability", hotelController.getRoomAvailability);

// Get individual hotel
router.get("/:id", hotelController.getHotelById);

module.exports = router;
