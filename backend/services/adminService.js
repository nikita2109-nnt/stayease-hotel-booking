
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminModel = require("../models/adminModel");

const loginAdmin = async (username, password) => {
  // Find admin by username
  const admin = await adminModel.getAdminByUsername(username);

  // Check whether admin exists and is active
  if (!admin || !admin.is_active) {
    throw new Error("Invalid username or password");
  }

  // Compare entered password with stored bcrypt hash
  const isPasswordValid = await bcrypt.compare(
    password,
    admin.password_hash
  );

  if (!isPasswordValid) {
    throw new Error("Invalid username or password");
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      adminId: admin.id,
      username: admin.username,
      role: "ADMIN"
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h"
    }
  );

  return {
    admin: {
      id: admin.id,
      username: admin.username
    },
    token
  };
};

module.exports = {
  loginAdmin
};
