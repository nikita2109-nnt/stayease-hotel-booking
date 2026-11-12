
import api from "./api";

// Create a new booking
export const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

// Retrieve an existing booking
export const lookupBooking = async (bookingData) => {
  const response = await api.post("/bookings/lookup", bookingData);
  return response.data;
};

// Cancel an existing booking
export const cancelBooking = async (bookingData) => {
  const response = await api.post("/bookings/cancel", bookingData);
  return response.data;
};
