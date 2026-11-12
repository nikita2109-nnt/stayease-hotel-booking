
const pool = require("../config/db");


const checkRoomAvailability = async (
  connection,
  roomTypeId,
  checkIn,
  checkOut
) => {
  // Lock the room type row until the transaction finishes
  const [rooms] = await connection.execute(
    `SELECT id, total_rooms, price_per_night
    FROM room_types
    WHERE id = ?
     FOR UPDATE`,
    [roomTypeId]
  );

  // Check whether the room type exists
  if (rooms.length === 0) {
    return null;
  }

  // Count existing bookings that overlap with requested dates
  const [rows] = await connection.execute(
    `SELECT COUNT(*) AS booked_rooms
     FROM bookings
     WHERE room_type_id = ?
       AND status = 'CONFIRMED'
       AND check_in < ?
       AND check_out > ?`,
    [roomTypeId, checkOut, checkIn]
  );

  const totalRooms = rooms[0].total_rooms;
  const bookedRooms = rows[0].booked_rooms;

  return {
  totalRooms,
  bookedRooms,
  availableRooms: totalRooms - bookedRooms,
  pricePerNight: rooms[0].price_per_night
};
};


const createBooking = async (connection, bookingData) => {
  const {
    bookingReference,
    roomTypeId,
    customerName,
    customerEmail,
    checkIn,
    checkOut,
    totalNights,
    subtotal,
    discountAmount,
    finalAmount
  } = bookingData;

  const [result] = await connection.execute(
    `INSERT INTO bookings (
      booking_reference,
      room_type_id,
      customer_name,
      customer_email,
      check_in,
      check_out,
      total_nights,
      subtotal,
      discount_amount,
      final_amount,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED')`,
    [
      bookingReference,
      roomTypeId,
      customerName,
      customerEmail,
      checkIn,
      checkOut,
      totalNights,
      subtotal,
      discountAmount,
      finalAmount
    ]
  );

  return result.insertId;
};


const getBookingByReference = async (
  bookingReference,
  customerEmail
) => {
  const [rows] = await pool.execute(
    `SELECT
        b.id AS booking_id,
        b.booking_reference,
        b.customer_name,
        b.customer_email,
        b.check_in,
        b.check_out,
        b.total_nights,
        b.subtotal,
        b.discount_amount,
        b.final_amount,
        b.status,
        b.created_at,
        h.name AS hotel_name,
        h.location,
        r.room_name,
        r.price_per_night
     FROM bookings b
     JOIN room_types r
       ON b.room_type_id = r.id
     JOIN hotels h
       ON r.hotel_id = h.id
     WHERE b.booking_reference = ?
       AND LOWER(b.customer_email) = LOWER(?)
     LIMIT 1`,
    [bookingReference, customerEmail]
  );

  return rows.length > 0 ? rows[0] : null;
};


// Find a booking and lock its row during cancellation
const getBookingForCancellation = async (
  connection,
  bookingReference,
  customerEmail
) => {
  const [rows] = await connection.execute(
    `SELECT
  id,
  booking_reference,
  status,
  DATE_FORMAT(check_in, '%Y-%m-%d') AS check_in,
  coupon_id
     FROM bookings
     WHERE booking_reference = ?
       AND LOWER(customer_email) = LOWER(?)
     LIMIT 1
     FOR UPDATE`,
    [bookingReference, customerEmail]
  );

  return rows.length > 0 ? rows[0] : null;
};

// Update booking status to CANCELLED
const cancelBooking = async (connection, bookingId) => {
  await connection.execute(
    `UPDATE bookings
     SET status = 'CANCELLED'
     WHERE id = ?`,
    [bookingId]
  );
};


const releaseCouponUsage = async (connection, bookingId) => {
  // Check whether this booking has a redeemed coupon
  const [usageRows] = await connection.execute(
    `SELECT coupon_id
     FROM coupon_usages
     WHERE booking_id = ?
       AND status = 'REDEEMED'
     LIMIT 1
     FOR UPDATE`,
    [bookingId]
  );

  // No coupon was used, so nothing needs to be restored
  if (usageRows.length === 0) {
    return;
  }

  const couponId = usageRows[0].coupon_id;

  // Restore one coupon usage
  await connection.execute(
    `UPDATE coupons
     SET usage_count = GREATEST(usage_count - 1, 0)
     WHERE id = ?`,
    [couponId]
  );

  // Preserve history by marking the usage as RELEASED
  await connection.execute(
    `UPDATE coupon_usages
     SET status = 'RELEASED',
         released_at = CURRENT_TIMESTAMP
     WHERE booking_id = ?
       AND status = 'REDEEMED'`,
    [bookingId]
  );
};


module.exports = {
  createBooking,
  checkRoomAvailability,
  getBookingByReference,
  getBookingForCancellation,
  cancelBooking,
  releaseCouponUsage
};
