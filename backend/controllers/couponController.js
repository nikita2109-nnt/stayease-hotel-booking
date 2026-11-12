
const couponService = require("../services/couponService");

const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      maxDiscount,
      minBookingAmount,
      usageLimit,
      startDate,
      expiryDate
    } = req.body;

    // Validate required fields
    if (
      !code ||
      !discountType ||
      discountValue === undefined ||
      usageLimit === undefined ||
      !startDate ||
      !expiryDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required coupon details"
      });
    }

    // Call service layer
    const result = await couponService.createCoupon(
      {
        code,
        discountType,
        discountValue,
        maxDiscount: maxDiscount ?? null,
        minBookingAmount: minBookingAmount ?? 0,
        usageLimit,
        startDate,
        expiryDate
      },
      req.admin.adminId
    );

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: result
    });

  } catch (error) {
    console.error("Create Coupon Error:", error.message);

    if (
      error.message.includes("must") ||
      error.message.includes("cannot") ||
      error.message.includes("Invalid") ||
      error.message.includes("Expiry date")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating coupon"
    });
  }
};


const getAllCoupons = async (req, res) => {
  try {
    const coupons = await couponService.getAllCoupons();

    return res.status(200).json({
      success: true,
      message: "Coupons retrieved successfully",
      count: coupons.length,
      data: coupons
    });

  } catch (error) {
    console.error("Get Coupons Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while retrieving coupons"
    });
  }
};


const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate coupon ID
    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon ID"
      });
    }

    const {
      discountType,
      discountValue,
      maxDiscount,
      minBookingAmount,
      usageLimit,
      startDate,
      expiryDate
    } = req.body;

    // Validate required fields
    if (
      discountType === undefined ||
      discountValue === undefined ||
      usageLimit === undefined ||
      startDate === undefined ||
      expiryDate === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required coupon details"
      });
    }

    const result = await couponService.updateCoupon(
      Number(id),
      {
        discountType,
        discountValue,
        maxDiscount: maxDiscount ?? null,
        minBookingAmount: minBookingAmount ?? 0,
        usageLimit,
        startDate,
        expiryDate
      }
    );

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: result
    });

  } catch (error) {
    console.error("Update Coupon Error:", error.message);

    if (error.message === "Coupon not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (
      error.message.includes("must") ||
      error.message.includes("cannot") ||
      error.message.includes("Invalid") ||
      error.message.includes("Expiry date")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating coupon"
    });
  }
};


const deactivateCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate coupon ID
    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon ID"
      });
    }

    const result = await couponService.deactivateCoupon(Number(id));

    return res.status(200).json({
      success: true,
      message: "Coupon deactivated successfully",
      data: result
    });

  } catch (error) {
    console.error("Deactivate Coupon Error:", error.message);

    if (error.message === "Coupon not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message === "Coupon is already inactive") {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong while deactivating coupon"
    });
  }
};


const deleteUnusedCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate coupon ID
    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon ID"
      });
    }

    const result = await couponService.deleteUnusedCoupon(Number(id));

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
      data: result
    });

  } catch (error) {
    console.error("Delete Coupon Error:", error.message);

    if (error.message === "Coupon not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message === "Used coupons cannot be permanently deleted") {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting coupon"
    });
  }
};

const couponModel = require("../models/couponModel");

const getAvailableCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.getAllAvailableCoupons();

    return res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons
    });
  } catch (error) {
    console.error("Get available coupons error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch available coupons"
    });
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deactivateCoupon,
  deleteUnusedCoupon,
  getAvailableCoupons
};