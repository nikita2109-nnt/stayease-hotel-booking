
import { useState } from "react";
import { lookupBooking, cancelBooking } from "../services/bookingService";
import Navbar from "../components/Navbar";
import {
  MapPin,
  BedDouble,
  IndianRupee,
} from "lucide-react";

function BookingLookupPage() {
  const [formData, setFormData] = useState({
    bookingReference: "",
    customerEmail: "",
  });

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Retrieve booking
  const handleLookup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setMessage("");
      setBooking(null);

      const response = await lookupBooking(formData);

      setBooking(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to retrieve booking."
      );
    } finally {
      setLoading(false);
    }
  };

  // Cancel booking
  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      setCancelling(true);
      setError("");
      setMessage("");

      const response = await cancelBooking(formData);

      setBooking((prev) => ({
        ...prev,
        status: response.data.status,
      }));

      setMessage("Booking cancelled successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to cancel booking."
      );
    } finally {
      setCancelling(false);
    }
  };

  // Format dates in Indian format
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });
  };

  // Get date in IST (YYYY-MM-DD)
  const getISTDate = (date) => {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date));
  };

  // Check whether booking can be cancelled
  const canCancel =
    booking?.status === "CONFIRMED" &&
    getISTDate(booking.check_in) >
      getISTDate(new Date());

  return (
    <>
      <Navbar />

      <section className="lookup-page">
        <div className="lookup-heading">
          <span>YOUR RESERVATIONS</span>
          <h1>Manage Your Booking</h1>
          <p>
            Enter your booking reference and email to continue.
          </p>
        </div>

        {/* Booking Lookup Form */}
        <form className="lookup-form" onSubmit={handleLookup}>
          <div className="form-group">
            <label>Booking Reference</label>

            <input
              type="text"
              name="bookingReference"
              placeholder="Example: STAY-XXXXXXXXXXXX"
              value={formData.bookingReference}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              name="customerEmail"
              placeholder="Enter your booking email"
              value={formData.customerEmail}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <p className="booking-error">{error}</p>
          )}

          <button
            type="submit"
            className="confirm-booking-button"
            disabled={loading}
          >
            {loading ? "Searching..." : "Find My Booking"}
          </button>
        </form>

        {/* Success Message */}
        {message && (
          <p className="success-message">{message}</p>
        )}

        {/* Booking Details */}
        {booking && (
          <div className="lookup-result">
            <div className="result-header">
              <div>
                <span>BOOKING REFERENCE</span>
                <h2>{booking.booking_reference}</h2>
              </div>

              <span
                className={`booking-status ${booking.status.toLowerCase()}`}
              >
                {booking.status}
              </span>
            </div>

            <h2>{booking.hotel_name}</h2>

            <p className="result-info">
              <MapPin size={17} />
              {booking.location}
            </p>

            <p className="result-info">
              <BedDouble size={17} />
              {booking.room_name}
            </p>

            {/* Check-in and Check-out */}
            <div className="result-dates">
              <div>
                <span>CHECK-IN</span>
                <strong>
                  {formatDate(booking.check_in)}
                </strong>
              </div>

              <div>
                <span>CHECK-OUT</span>
                <strong>
                  {formatDate(booking.check_out)}
                </strong>
              </div>
            </div>

            {/* Price Summary */}
            <div className="result-summary">
              <p>
                Total Nights:{" "}
                <strong>{booking.total_nights}</strong>
              </p>

              <p>
                Subtotal:
                <strong>
                  {" "}₹
                  {Number(booking.subtotal).toLocaleString("en-IN")}
                </strong>
              </p>

              <p>
                Discount:
                <strong>
                  {" "}₹
                  {Number(booking.discount_amount).toLocaleString("en-IN")}
                </strong>
              </p>

              <h3>
                <IndianRupee size={20} />
                {Number(booking.final_amount).toLocaleString("en-IN")}
              </h3>
            </div>

            {/* Cancellation Error */}
            {error && (
              <p className="booking-error">{error}</p>
            )}

            {/* Cancel Booking Button */}
            {canCancel && (
              <button
                type="button"
                className="cancel-booking-button"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling
                  ? "Cancelling..."
                  : "Cancel Booking"}
              </button>
            )}

            {/* Cancellation Information */}
            {booking.status === "CANCELLED" && (
              <p className="success-message">
                This booking has been cancelled.
              </p>
            )}

            {booking.status === "CONFIRMED" && !canCancel && (
              <p className="booking-error">
                This booking can no longer be cancelled.
              </p>
            )}
          </div>
        )}
      </section>
    </>
  );
}

export default BookingLookupPage;
