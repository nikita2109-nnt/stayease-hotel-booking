
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createBooking } from "../services/bookingService";
import { getHotels } from "../services/hotelService";
import Navbar from "../components/Navbar";
import CouponOffers from "../components/CouponOffers";

function BookingPage() {
  const { roomTypeId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    checkIn: "",
    checkOut: "",
    couponCode: "",
  });

  const [room, setRoom] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch room details and price
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await getHotels();

        const rooms = response.data || [];

        const selectedRoom = rooms.find(
          (item) => Number(item.room_type_id) === Number(roomTypeId)
        );

        setRoom(selectedRoom || null);
      } catch (err) {
        console.error("Error fetching room details:", err);
      }
    };

    fetchRoomDetails();
  }, [roomTypeId]);

  // Calculate total nights
  const calculateNights = () => {
    const { checkIn, checkOut } = formData;

    if (!checkIn || !checkOut) return 0;

    const [inYear, inMonth, inDay] = checkIn.split("-").map(Number);
    const [outYear, outMonth, outDay] = checkOut.split("-").map(Number);

    const start = Date.UTC(inYear, inMonth - 1, inDay);
    const end = Date.UTC(outYear, outMonth - 1, outDay);

    return Math.max(0, (end - start) / (1000 * 60 * 60 * 24));
  };

  const totalNights = calculateNights();

  const subtotal = room
    ? Number(room.price_per_night) * totalNights
    : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "couponCode" && appliedCoupon?.code !== value) {
      setAppliedCoupon(null);
    }
  };

  const handleApplyCoupon = (coupon) => {
    setAppliedCoupon(coupon);

    setFormData((prev) => ({
      ...prev,
      couponCode: coupon.code,
    }));
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);

    setFormData((prev) => ({
      ...prev,
      couponCode: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const bookingData = {
        roomTypeId: Number(roomTypeId),
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        couponCode: formData.couponCode.trim() || null,
      };

      const response = await createBooking(bookingData);

      navigate("/booking-confirmation", {
        state: response.data,
      });

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to create booking. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <section className="booking-page">
        <div className="booking-heading">
          <span>COMPLETE YOUR RESERVATION</span>
          <h1>Book Your Stay</h1>
          <p>Just a few details before your journey begins.</p>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              name="customerName"
              placeholder="Enter your full name"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="customerEmail"
              placeholder="Enter your email"
              value={formData.customerEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Check-in Date</label>
              <input
                type="date"
                name="checkIn"
                min={new Date().toLocaleDateString("en-CA")}
                value={formData.checkIn}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Check-out Date</label>
              <input
                type="date"
                name="checkOut"
                min={
                  formData.checkIn
                    ? (() => {
                        const date = new Date(
                          `${formData.checkIn}T00:00:00`
                        );
                        date.setDate(date.getDate() + 1);
                        return date.toLocaleDateString("en-CA");
                      })()
                    : new Date().toLocaleDateString("en-CA")
                }
                value={formData.checkOut}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {room && totalNights > 0 && (
            <div className="booking-price-summary">
              <p>Price per night: ₹{Number(room.price_per_night).toLocaleString("en-IN")}</p>
              <p>Total nights: {totalNights}</p>
              <p>
                <strong>
                  Booking subtotal: ₹{subtotal.toLocaleString("en-IN")}
                </strong>
              </p>
            </div>
          )}

          <CouponOffers
            subtotal={subtotal}
            appliedCoupon={appliedCoupon}
            onApply={handleApplyCoupon}
            onRemove={handleRemoveCoupon}
          />

          <div className="form-group">
            <label>Coupon Code (Optional)</label>
            <input
              type="text"
              name="couponCode"
              placeholder="Enter coupon code"
              value={formData.couponCode}
              onChange={handleChange}
            />
          </div>

          {error && <p className="booking-error">{error}</p>}

          <button
            type="submit"
            className="confirm-booking-button"
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </button>
        </form>
      </section>
    </>
  );
}

export default BookingPage;
