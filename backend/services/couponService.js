
const couponModel = require("../models/couponModel");

// Validate and normalize coupon dates
const normalizeCouponDates = (startDate, expiryDate) => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  const isValidDate = (date) => {
    if (
      typeof date !== "string" ||
      !datePattern.test(date)
    ) {
      return false;
    }

    const parsedDate = new Date(`${date}T00:00:00.000Z`);

    return (
      !Number.isNaN(parsedDate.getTime()) &&
      parsedDate.toISOString().slice(0, 10) === date
    );
  };

  if (!isValidDate(startDate) || !isValidDate(expiryDate)) {
    throw new Error("Invalid coupon dates");
  }

  if (expiryDate < startDate) {
    throw new Error(
      "Expiry date must be after or equal to start date"
    );
  }

  return {
    startDate: `${startDate} 00:00:00`,
    expiryDate: `${expiryDate} 23:59:59`
  };
};


// Create a new coupon
const createCoupon = async (couponData, adminId) => {
  const {
    code,
    discountType,
    discountValue,
    maxDiscount,
    minBookingAmount,
    usageLimit,
    startDate,
    expiryDate
  } = couponData;

  // Validate coupon code
  if (
    typeof code !== "string" ||
    code.trim().length === 0 ||
    code.trim().length > 50
  ) {
    throw new Error("Invalid coupon code");
  }

  // Normalize coupon code
  const normalizedCode = code.trim().toUpperCase();

  // Validate discount type
  if (!["PERCENTAGE", "FIXED"].includes(discountType)) {
    throw new Error("Invalid discount type");
  }

  // Validate discount value
  if (
    !Number.isFinite(Number(discountValue)) ||
    Number(discountValue) <= 0
  ) {
    throw new Error("Discount value must be greater than zero");
  }

  // Percentage discount cannot exceed 100
  if (
    discountType === "PERCENTAGE" &&
    Number(discountValue) > 100
  ) {
    throw new Error("Percentage discount cannot exceed 100");
  }

  // Validate optional maximum discount
  if (
    maxDiscount !== null &&
    maxDiscount !== undefined &&
    (
      !Number.isFinite(Number(maxDiscount)) ||
      Number(maxDiscount) <= 0
    )
  ) {
    throw new Error("Maximum discount must be greater than zero");
  }

  // Validate minimum booking amount
  if (
    !Number.isFinite(Number(minBookingAmount)) ||
    Number(minBookingAmount) < 0
  ) {
    throw new Error("Minimum booking amount cannot be negative");
  }

  // Validate usage limit
  if (
    !Number.isInteger(Number(usageLimit)) ||
    Number(usageLimit) <= 0
  ) {
    throw new Error("Usage limit must be a positive integer");
  }

  // Validate and normalize dates
  const normalizedDates = normalizeCouponDates(
    startDate,
    expiryDate
  );

  // Create coupon
  const couponId = await couponModel.createCoupon(
    {
      ...couponData,
      ...normalizedDates,
      code: normalizedCode,
      maxDiscount: maxDiscount ?? null
    },
    adminId
  );

  return {
    couponId,
    code: normalizedCode,
    message: "Coupon created successfully"
  };
};


// Get all coupons
const getAllCoupons = async () => {
  const coupons = await couponModel.getAllCoupons();

  return coupons;
};


// Update an existing coupon
const updateCoupon = async (couponId, couponData) => {
  // Check whether coupon exists
  const existingCoupon = await couponModel.getCouponById(couponId);

  if (!existingCoupon) {
    throw new Error("Coupon not found");
  }

  const {
    discountType,
    discountValue,
    maxDiscount,
    minBookingAmount,
    usageLimit,
    startDate,
    expiryDate
  } = couponData;

  // Validate discount type
  if (!["PERCENTAGE", "FIXED"].includes(discountType)) {
    throw new Error("Invalid discount type");
  }

  // Validate discount value
  if (
    !Number.isFinite(Number(discountValue)) ||
    Number(discountValue) <= 0
  ) {
    throw new Error("Discount value must be greater than zero");
  }

  // Percentage discount cannot exceed 100
  if (
    discountType === "PERCENTAGE" &&
    Number(discountValue) > 100
  ) {
    throw new Error("Percentage discount cannot exceed 100");
  }

  // Validate maximum discount
  if (
    maxDiscount !== null &&
    maxDiscount !== undefined &&
    (
      !Number.isFinite(Number(maxDiscount)) ||
      Number(maxDiscount) <= 0
    )
  ) {
    throw new Error("Maximum discount must be greater than zero");
  }

  // Validate minimum booking amount
  if (
    !Number.isFinite(Number(minBookingAmount)) ||
    Number(minBookingAmount) < 0
  ) {
    throw new Error("Minimum booking amount cannot be negative");
  }

  // Validate usage limit
  if (
    !Number.isInteger(Number(usageLimit)) ||
    Number(usageLimit) <= 0
  ) {
    throw new Error("Usage limit must be a positive integer");
  }

  // Existing redemptions cannot exceed the new usage limit
  if (Number(usageLimit) < Number(existingCoupon.usage_count)) {
    throw new Error(
      "Usage limit cannot be less than current usage count"
    );
  }

  // Validate and normalize dates
  const normalizedDates = normalizeCouponDates(
    startDate,
    expiryDate
  );

  // Update coupon
  const updatedRows = await couponModel.updateCoupon(
    couponId,
    {
      ...couponData,
      ...normalizedDates,
      maxDiscount: maxDiscount ?? null
    }
  );

  if (updatedRows === 0) {
    throw new Error("Coupon could not be updated");
  }

  return {
    couponId,
    message: "Coupon updated successfully"
  };
};


// Deactivate a coupon
const deactivateCoupon = async (couponId) => {
  // Check whether coupon exists
  const existingCoupon = await couponModel.getCouponById(couponId);

  if (!existingCoupon) {
    throw new Error("Coupon not found");
  }

  // Check whether coupon is already inactive
  if (!existingCoupon.is_active) {
    throw new Error("Coupon is already inactive");
  }

  // Deactivate coupon
  await couponModel.deactivateCoupon(couponId);

  return {
    couponId,
    status: "INACTIVE",
    message: "Coupon deactivated successfully"
  };
};


// Permanently delete an unused coupon
const deleteUnusedCoupon = async (couponId) => {
  // Check whether coupon exists
  const existingCoupon = await couponModel.getCouponById(couponId);

  if (!existingCoupon) {
    throw new Error("Coupon not found");
  }

  // Delete only if there is no redemption history
  const deletedRows = await couponModel.deleteUnusedCoupon(couponId);

  if (deletedRows === 0) {
    throw new Error(
      "Used coupons cannot be permanently deleted"
    );
  }

  return {
    couponId,
    message: "Coupon deleted successfully"
  };
};


// Validate coupon during booking
const validateCoupon = async (connection, code, subtotal) => {
  // Validate coupon code
  if (
    typeof code !== "string" ||
    code.trim().length === 0
  ) {
    throw new Error("Coupon code is required");
  }

  // Validate booking amount
  if (
    !Number.isFinite(Number(subtotal)) ||
    Number(subtotal) <= 0
  ) {
    throw new Error("Invalid booking amount");
  }

  const normalizedCode = code.trim().toUpperCase();

  // Retrieve and lock coupon record
  const coupon = await couponModel.getCouponForUpdate(
    connection,
    normalizedCode
  );

  if (!coupon) {
    throw new Error("Invalid coupon code");
  }

  // Check active status
  if (!coupon.is_active) {
    throw new Error("Coupon is inactive");
  }

  // Check coupon validity using MySQL's IST time
  if (!coupon.has_started) {
    throw new Error("Coupon is not active yet");
  }

  if (!coupon.not_expired) {
    throw new Error("Coupon has expired");
  }

  // Check usage limit
  if (Number(coupon.usage_count) >= Number(coupon.usage_limit)) {
    throw new Error("Coupon usage limit reached");
  }

  // Check minimum booking amount
  if (
    Number(subtotal) <
    Number(coupon.min_booking_amount)
  ) {
    throw new Error(
      `Minimum booking amount is ₹${coupon.min_booking_amount}`
    );
  }

  // Calculate discount
  let discountAmount;

  if (coupon.discount_type === "PERCENTAGE") {
    discountAmount =
      Number(subtotal) *
      Number(coupon.discount_value) / 100;

    // Apply maximum discount limit if configured
    if (coupon.max_discount !== null) {
      discountAmount = Math.min(
        discountAmount,
        Number(coupon.max_discount)
      );
    }
  } else {
    // Fixed discount cannot exceed booking amount
    discountAmount = Math.min(
      Number(coupon.discount_value),
      Number(subtotal)
    );
  }

  // Round discount to two decimal places
  discountAmount = Math.round(
    (discountAmount + Number.EPSILON) * 100
  ) / 100;

  // Calculate final booking amount
  const finalAmount = Math.round(
    (Number(subtotal) - discountAmount + Number.EPSILON) * 100
  ) / 100;

  return {
    couponId: coupon.id,
    couponCode: coupon.code,
    discountType: coupon.discount_type,
    discountValue: Number(coupon.discount_value),
    discountAmount,
    finalAmount
  };
};


module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deactivateCoupon,
  deleteUnusedCoupon,
  validateCoupon
};
