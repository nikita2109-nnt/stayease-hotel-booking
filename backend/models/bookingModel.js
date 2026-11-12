
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

module.exports = {
  createBooking,
  checkRoomAvailability
};
