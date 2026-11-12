const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/login", adminController.loginAdmin);

router.get(
  "/profile",
  authMiddleware,
  adminController.getAdminProfile
);

module.exports = router;