
const pool = require("../config/db");
const bookingModel = require("../models/bookingModel");
const { randomUUID } = require("crypto");

// Generate unique booking reference
const generateBookingReference = () => {
  return "STAY-" + randomUUID()
    .replace(/-/g, "")
    .slice(0, 12)
    .toUpperCase();
};

const createBooking = async (bookingData) => {
  // Get a connection from the connection pool
  const connection = await pool.getConnection();

  let transactionStarted = false;

  try {
    // Start transaction
    await connection.beginTransaction();
    transactionStarted = true;

    const {
      roomTypeId,
      checkIn,
      checkOut
    } = bookingData;

    // Check room availability with row-level locking
    const availability =
      await bookingModel.checkRoomAvailability(
        connection,
        roomTypeId,
        checkIn,
        checkOut
      );

    // Check whether room type exists
    if (!availability) {
      throw new Error("Room type not found");
    }

    // Check whether rooms are available
    if (availability.availableRooms <= 0) {
      throw new Error(
        "No rooms available for selected dates"
      );
    }

    // Calculate total nights
    const totalNights = Math.round(
      (new Date(checkOut + "T00:00:00Z") -
       new Date(checkIn + "T00:00:00Z")) /
      (1000 * 60 * 60 * 24)
    );

    // Get actual room price from database
    const pricePerNight = Number(
      availability.pricePerNight
    );

    // Calculate subtotal
    const subtotal = Number(
      (pricePerNight * totalNights).toFixed(2)
    );

    // No coupon applied for now
    const discountAmount = 0;

    // Calculate final amount
    const finalAmount = Number(
      (subtotal - discountAmount).toFixed(2)
    );

    // Generate booking reference
    const bookingReference =
      generateBookingReference();

    // Insert booking
    const bookingId = await bookingModel.createBooking(
      connection,
      {
        ...bookingData,
        bookingReference,
        totalNights,
        subtotal,
        discountAmount,
        finalAmount
      }
    );

    // Commit transaction
    await connection.commit();
    transactionStarted = false;

    return {
      bookingId,
      bookingReference,
      totalNights,
      subtotal,
      discountAmount,
      finalAmount
    };

  } catch (error) {
    // Rollback if transaction has started
    if (transactionStarted) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error(
          "Rollback Error:",
          rollbackError.message
        );
      }
    }

    throw error;

  } finally {
    // Always release connection
    connection.release();
  }
};

module.exports = {
  createBooking
};
