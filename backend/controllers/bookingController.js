
const bookingService = require("../services/bookingService");

// Validate date format and actual calendar date
const isValidDate = (value) => {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
};

// Validate email address
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};


// Create a new booking
const createBooking = async (req, res) => {
  try {
    const {
      roomTypeId,
      customerName,
      customerEmail,
      checkIn,
      checkOut,
      couponCode
    } = req.body;

    // 1. Validate room type ID
    if (
      !Number.isInteger(Number(roomTypeId)) ||
      Number(roomTypeId) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid room type ID"
      });
    }

    // 2. Validate customer name
    if (
      typeof customerName !== "string" ||
      customerName.trim().length < 2 ||
      customerName.trim().length > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Customer name must be between 2 and 100 characters"
      });
    }

    // 3. Validate customer email
    if (
      typeof customerEmail !== "string" ||
      !isValidEmail(customerEmail.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address"
      });
    }

    // 4. Validate check-in and check-out dates
    if (!isValidDate(checkIn) || !isValidDate(checkOut)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use YYYY-MM-DD"
      });
    }

    // 5. Check-out must be after check-in
    if (checkOut <= checkIn) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date"
      });
    }

    // 6. Prevent past check-in dates
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata"
    });

    if (checkIn < today) {
      return res.status(400).json({
        success: false,
        message: "Check-in date cannot be in the past"
      });
    }

    // 7. Validate optional coupon code
    if (
      couponCode !== undefined &&
      couponCode !== null &&
      typeof couponCode !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon code"
      });
    }

    if (
      typeof couponCode === "string" &&
      couponCode.trim().length > 50
    ) {
      return res.status(400).json({
        success: false,
        message: "Coupon code cannot exceed 50 characters"
      });
    }

    // 8. Call booking service
    const booking = await bookingService.createBooking({
      roomTypeId: Number(roomTypeId),
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      checkIn,
      checkOut,
      couponCode: couponCode?.trim() || null
    });

    // 9. Send success response
    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking
    });

  } catch (error) {
    console.error("Booking Error:", error.message);

    // Room type not found
    if (error.message === "Room type not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    // No rooms available
    if (
      error.message === "No rooms available for selected dates"
    ) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    // Coupon validation errors
    const couponErrors = [
      "Invalid coupon code",
      "Coupon is inactive",
      "Coupon is not active yet",
      "Coupon has expired",
      "Minimum booking amount is",
      "Invalid coupon dates",
      "Invalid booking amount"
    ];

    if (
      couponErrors.some((message) =>
        error.message.startsWith(message)
      )
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // Coupon usage limit reached
    if (error.message === "Coupon usage limit reached") {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    // Unexpected server error
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating booking"
    });
  }
};


// Retrieve booking using reference and email
const getBookingByReference = async (req, res) => {
  try {
    const { bookingReference, customerEmail } = req.body;

    // Validate booking reference
    if (
      typeof bookingReference !== "string" ||
      bookingReference.trim().length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Booking reference is required"
      });
    }

    // Validate customer email
    if (
      typeof customerEmail !== "string" ||
      !isValidEmail(customerEmail.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid customer email is required"
      });
    }

    // Call booking service
    const booking = await bookingService.getBookingByReference(
      bookingReference.trim(),
      customerEmail.trim()
    );

    return res.status(200).json({
      success: true,
      message: "Booking retrieved successfully",
      data: booking
    });

  } catch (error) {
    console.error("Booking Lookup Error:", error.message);

    if (error.message === "Booking not found") {
      return res.status(404).json({
        success: false,
        message: "Booking not found. Please check your reference and email."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong while retrieving booking"
    });
  }
};


// Cancel an existing booking
const cancelBooking = async (req, res) => {
  try {
    const { bookingReference, customerEmail } = req.body;

    // Validate booking reference
    if (
      typeof bookingReference !== "string" ||
      bookingReference.trim().length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Booking reference is required"
      });
    }

    // Validate email
    if (
      typeof customerEmail !== "string" ||
      !isValidEmail(customerEmail.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid customer email is required"
      });
    }

    const result = await bookingService.cancelBooking(
      bookingReference.trim(),
      customerEmail.trim()
    );

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: result
    });

  } catch (error) {
    console.error("Booking Cancellation Error:", error.message);

    if (error.message === "Booking not found") {
      return res.status(404).json({
        success: false,
        message: "Booking not found. Please check your reference and email."
      });
    }

    if (error.message === "Booking is not confirmed") {
      return res.status(409).json({
        success: false,
        message: "This booking is already cancelled or cannot be cancelled."
      });
    }

    if (
      error.message ===
      "Cancellation is not allowed on or after check-in date"
    ) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong while cancelling the booking"
    });
  }
};


module.exports = {
  createBooking,
  getBookingByReference,
  cancelBooking
};
