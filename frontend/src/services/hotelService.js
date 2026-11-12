
import api from "./api";

// Get all hotels
export const getHotels = async () => {
  const response = await api.get("/hotels");
  return response.data;
};

// Search hotels by location
export const searchHotels = async (location) => {
  const response = await api.get("/hotels/search", {
    params: { location },
  });

  return response.data;
};

// Get details of a particular hotel
export const getHotelById = async (hotelId) => {
  const response = await api.get(`/hotels/${hotelId}`);
  return response.data;
};

// Get room availability
export const getRoomAvailability = async (
  hotelId,
  checkIn,
  checkOut
) => {
  const response = await api.get(
    `/hotels/${hotelId}/availability`,
    {
      params: { checkIn, checkOut },
    }
  );

  return response.data;
};
