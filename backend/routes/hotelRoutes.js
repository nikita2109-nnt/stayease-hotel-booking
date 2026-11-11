
const express = require("express");

const router = express.Router();

const hotelController = require("../controllers/hotelController");

// GET all hotels
router.get("/", hotelController.getAllHotels);

module.exports = router;
