
const pool = require("../config/db");

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

  const [result] = await pool.execute(
    `INSERT INTO coupons (
      code,
      discount_type,
      discount_value,
      max_discount,
      min_booking_amount,
      usage_limit,
      usage_count,
      start_date,
      expiry_date,
      is_active,
      created_by
    )
    VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, TRUE, ?)`,
    [
      code,
      discountType,
      discountValue,
      maxDiscount,
      minBookingAmount,
      usageLimit,
      startDate,
      expiryDate,
      adminId
    ]
  );

  return result.insertId;
};


const getAllCoupons = async () => {
  const [rows] = await pool.execute(
    `SELECT
       id,
       code,
       discount_type,
       discount_value,
       max_discount,
       min_booking_amount,
       usage_limit,
       usage_count,
       start_date,
       expiry_date,
       is_active,
       created_at
     FROM coupons
     ORDER BY created_at DESC`
  );

  return rows;
};


const getCouponById = async (couponId) => {
  const [rows] = await pool.execute(
    `SELECT *
     FROM coupons
     WHERE id = ?
     LIMIT 1`,
    [couponId]
  );

  return rows.length > 0 ? rows[0] : null;
};

const updateCoupon = async (couponId, couponData) => {
  const {
    discountType,
    discountValue,
    maxDiscount,
    minBookingAmount,
    usageLimit,
    startDate,
    expiryDate
  } = couponData;

  const [result] = await pool.execute(
    `UPDATE coupons
     SET discount_type = ?,
         discount_value = ?,
         max_discount = ?,
         min_booking_amount = ?,
         usage_limit = ?,
         start_date = ?,
         expiry_date = ?
     WHERE id = ?
       AND usage_count <= ?`,
    [
      discountType,
      discountValue,
      maxDiscount,
      minBookingAmount,
      usageLimit,
      startDate,
      expiryDate,
      couponId,
      usageLimit
    ]
  );

  return result.affectedRows;
};

const deactivateCoupon = async (couponId) => {
  const [result] = await pool.execute(
    `UPDATE coupons
     SET is_active = FALSE
     WHERE id = ?
       AND is_active = TRUE`,
    [couponId]
  );

  return result.affectedRows;
};


const deleteUnusedCoupon = async (couponId) => {
  const [result] = await pool.execute(
    `DELETE FROM coupons
     WHERE id = ?
       AND usage_count = 0
       AND NOT EXISTS (
         SELECT 1
         FROM coupon_usages
         WHERE coupon_id = ?
       )`,
    [couponId, couponId]
  );

  return result.affectedRows;
};


const getAvailableCoupons = async () => {
  const [rows] = await pool.execute(
    `SELECT
       id,
       code,
       description,
       discount_type,
       discount_value,
       max_discount,
       min_booking_amount,
       expiry_date
     FROM coupons
     WHERE is_active = TRUE
       AND usage_count < usage_limit
       AND start_date <= DATE_ADD(UTC_TIMESTAMP(), INTERVAL 330 MINUTE)
       AND expiry_date >= DATE_ADD(UTC_TIMESTAMP(), INTERVAL 330 MINUTE)
     ORDER BY created_at DESC`
  );

  return rows;
};


const getCouponForUpdate = async (connection, code) => {
  const [rows] = await connection.execute(
    `SELECT
       id,
       code,
       discount_type,
       discount_value,
       max_discount,
       min_booking_amount,
       usage_limit,
       usage_count,
       start_date,
       expiry_date,
       is_active,

       (start_date <= DATE_ADD(UTC_TIMESTAMP(), INTERVAL 330 MINUTE))
         AS has_started,

       (expiry_date >= DATE_ADD(UTC_TIMESTAMP(), INTERVAL 330 MINUTE))
         AS not_expired

     FROM coupons
     WHERE code = ?
     LIMIT 1
     FOR UPDATE`,
    [code]
  );

  return rows.length > 0 ? rows[0] : null;
};



module.exports = {
  createCoupon,
  getAllCoupons,
  getAllAvailableCoupons: getAvailableCoupons,
  getCouponById,
  updateCoupon,
  deactivateCoupon,
  deleteUnusedCoupon,
  getCouponForUpdate
};
