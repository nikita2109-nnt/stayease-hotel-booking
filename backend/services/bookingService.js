
const pool = require("../config/db");
const bookingModel = require("../models/bookingModel");
const { randomUUID } = require("crypto");
const couponService = require("./couponService");
// Generate unique booking reference
const generateBookingReference = () => {
  return "STAY-" + randomUUID()
    .replace(/-/g, "")
    .slice(0, 12)
    .toUpperCase();
};


const createBooking = async (bookingData) => {
  const connection = await pool.getConnection();

  let transactionStarted = false;

  try {
    await connection.beginTransaction();
    transactionStarted = true;

    const {
      roomTypeId,
      checkIn,
      checkOut,
      couponCode
    } = bookingData;

    // 1. Check room availability with row-level locking
    const availability = await bookingModel.checkRoomAvailability(
      connection,
      roomTypeId,
      checkIn,
      checkOut
    );

    if (!availability) {
      throw new Error("Room type not found");
    }

    if (availability.availableRooms <= 0) {
      throw new Error("No rooms available for selected dates");
    }

    // 2. Calculate total nights
    const totalNights = Math.round(
      (new Date(checkOut + "T00:00:00Z") -
       new Date(checkIn + "T00:00:00Z")) /
      (1000 * 60 * 60 * 24)
    );

    // 3. Calculate booking subtotal
    const pricePerNight = Number(availability.pricePerNight);

    const subtotal = Number(
      (pricePerNight * totalNights).toFixed(2)
    );

    // 4. Validate coupon, if provided
    let couponDetails = null;

    if (couponCode !== undefined && couponCode !== null) {
      if (typeof couponCode !== "string") {
        throw new Error("Invalid coupon code");
      }

      if (couponCode.trim().length > 0) {
        couponDetails = await couponService.validateCoupon(
          connection,
          couponCode,
          subtotal
        );
      }
    }

    // 5. Calculate discount and final amount
    const couponId = couponDetails
      ? couponDetails.couponId
      : null;

    const couponCodeSnapshot = couponDetails
      ? couponDetails.couponCode
      : null;

    const discountTypeSnapshot = couponDetails
      ? couponDetails.discountType
      : null;

    const discountValueSnapshot = couponDetails
      ? couponDetails.discountValue
      : null;

    const discountAmount = couponDetails
      ? couponDetails.discountAmount
      : 0;

    const finalAmount = couponDetails
      ? couponDetails.finalAmount
      : subtotal;

    // 6. Generate booking reference
    const bookingReference = generateBookingReference();

    // 7. Insert booking with coupon details
    const bookingId = await bookingModel.createBooking(
      connection,
      {
        ...bookingData,
        bookingReference,
        totalNights,
        subtotal,
        couponId,
        couponCodeSnapshot,
        discountTypeSnapshot,
        discountValueSnapshot,
        discountAmount,
        finalAmount
      }
    );

    // 8. Increase coupon usage and record redemption
    if (couponDetails) {
      await bookingModel.incrementCouponUsage(
        connection,
        couponId
      );

      await bookingModel.createCouponUsage(
        connection,
        couponId,
        bookingId
      );
    }

    // 9. Commit transaction
    await connection.commit();
    transactionStarted = false;

    return {
      bookingId,
      bookingReference,
      totalNights,
      subtotal,
      couponCode: couponCodeSnapshot,
      discountAmount,
      finalAmount
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
