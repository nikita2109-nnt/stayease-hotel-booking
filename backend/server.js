
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./config/db");

const app = express();

const PORT = process.env.PORT || 5000;
const hotelRoutes = require("./routes/hotelRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const adminRoutes = require("./routes/adminRoutes");

const couponRoutes = require("./routes/couponRoutes");
// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/bookings", bookingRoutes);

// Home API
app.get("/", (req, res) => {
    res.send("StayEase Backend is running!");
});

// Database connection test API
app.get("/api/test-db", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT NOW() AS currentTime, DATABASE() AS databaseName"
        );

        res.status(200).json({
            success: true,
            message: "MySQL connected successfully!",
            data: rows[0]
        });

    } catch (error) {
        console.error("Database error:", error.message);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});
app.use("/api/hotels", hotelRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/coupons", couponRoutes);
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


