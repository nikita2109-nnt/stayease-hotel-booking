
const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");

// Create a new booking
router.post("/", bookingController.createBooking);
// Retrieve booking using reference and email
router.post("/lookup", bookingController.getBookingByReference); 

router.post("/cancel", bookingController.cancelBooking);

module.exports = router;
