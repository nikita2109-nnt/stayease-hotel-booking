
const express = require("express");

const router = express.Router();

const hotelController = require("../controllers/hotelController");
// Search hotels
router.get("/search", hotelController.getHotelsByLocation);
// GET all hotels
router.get("/", hotelController.getAllHotels);
router.get("/:id", hotelController.getHotelById);
module.exports = router;
