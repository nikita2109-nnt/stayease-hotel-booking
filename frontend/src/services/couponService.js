
import api from "./api";

// Get coupons available to customers
export const getAvailableCoupons = async () => {
  const response = await api.get("/coupons/available");
  return response.data;
};

// Get all coupons for admin
export const getAllCoupons = async () => {
  const response = await api.get("/coupons");
  return response.data;
};

// Create a new coupon (Admin)
export const createCoupon = async (couponData) => {
  const response = await api.post("/coupons", couponData);
  return response.data;
};


// Delete an unused coupon (Admin)
export const deleteCoupon = async (couponId) => {
  const response = await api.delete(`/coupons/${couponId}`);
  return response.data;
};
