
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


const getBookingByReference = async (
  bookingReference,
  customerEmail
) => {
  const booking = await bookingModel.getBookingByReference(
    bookingReference,
    customerEmail
  );

  // Check whether booking exists
  if (!booking) {
    throw new Error("Booking not found");
  }

  return booking;
};


const cancelBooking = async (bookingReference, customerEmail) => {
  const connection = await pool.getConnection();
  let transactionStarted = false;

  try {
    await connection.beginTransaction();
    transactionStarted = true;

    // Find and lock the booking
    const booking = await bookingModel.getBookingForCancellation(
      connection,
      bookingReference,
      customerEmail
    );

    if (!booking) {
      throw new Error("Booking not found");
    }

    // Only confirmed bookings can be cancelled
    if (booking.status !== "CONFIRMED") {
      throw new Error("Booking is not confirmed");
    }

    // Get today's date in Indian Standard Time
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date());

    // Cancellation is not allowed on or after check-in
    if (booking.check_in <= today) {
      throw new Error("Cancellation is not allowed on or after check-in date");
    }

    // Cancel the booking
    await bookingModel.cancelBooking(connection, booking.id);

    // Restore coupon usage, if a coupon was used
    await bookingModel.releaseCouponUsage(connection, booking.id);

    await connection.commit();
    transactionStarted = false;

    return {
      bookingReference: booking.booking_reference,
      status: "CANCELLED"
    };

  } catch (error) {
    if (transactionStarted) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Rollback Error:", rollbackError.message);
      }
    }

    throw error;

  } finally {
    connection.release();
  }
};


module.exports = {
  createBooking,
  getBookingByReference,
  cancelBooking
};
