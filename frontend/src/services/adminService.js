
import api from "./api";

// Admin login
export const adminLogin = async (loginData) => {
  const response = await api.post("/admin/login", loginData);
  return response.data;
};

// Get admin profile
export const getAdminProfile = async () => {
  const response = await api.get("/admin/profile");
  return response.data;
};
