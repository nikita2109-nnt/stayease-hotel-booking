
const express = require("express");
const router = express.Router();

const couponController = require("../controllers/couponController");
const authMiddleware = require("../middleware/authMiddleware");

// Create coupon - Admin only
router.post(
  "/",
  authMiddleware,
  couponController.createCoupon
);
// Get all coupons
router.get(
  "/",
  authMiddleware,
  couponController.getAllCoupons
);

// Update coupon - Admin only
router.put(
  "/:id",
  authMiddleware,
  couponController.updateCoupon
);

// Deactivate coupon - Admin only
router.patch(
  "/:id/deactivate",
  authMiddleware,
  couponController.deactivateCoupon
);

// Permanently delete unused coupon - Admin only
router.delete(
  "/:id",
  authMiddleware,
  couponController.deleteUnusedCoupon
);

// Public - Get available coupons
router.get(
  "/available",
  couponController.getAvailableCoupons
);
module.exports = router;
