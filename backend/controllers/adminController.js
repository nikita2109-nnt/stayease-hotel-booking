
const adminService = require("../services/adminService");

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      typeof username !== "string" ||
      username.trim().length === 0 ||
      typeof password !== "string" ||
      password.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      });
    }

    const result = await adminService.loginAdmin(
      username.trim(),
      password
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      data: result
    });

  } catch (error) {
    console.error("Admin Login Error:", error.message);

    if (error.message === "Invalid username or password") {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong during admin login"
    });
  }
};

// Protected admin profile
const getAdminProfile = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Admin authenticated successfully",
    data: {
      adminId: req.admin.adminId,
      username: req.admin.username,
      role: req.admin.role
    }
  });
};

module.exports = {
  loginAdmin,
  getAdminProfile
};
