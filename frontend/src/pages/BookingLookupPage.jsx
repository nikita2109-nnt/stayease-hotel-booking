
import { useState } from "react";
import { lookupBooking, cancelBooking } from "../services/bookingService";
import Navbar from "../components/Navbar";
import { MapPin, CalendarDays, BedDouble, IndianRupee } from "lucide-react";

function BookingLookupPage() {
  const [formData, setFormData] = useState({
    bookingReference: "",
    customerEmail: "",
  });

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
        err.response?.data?.message || "Unable to retrieve booking."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await cancelBooking(formData);

      setBooking((prev) => ({
        ...prev,
        status: response.data.status,
      }));

      setMessage("Booking cancelled successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to cancel booking."
      );
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });
  };

  const canCancel =
    booking?.status === "CONFIRMED" &&
    new Date(booking.check_in).getTime() >
      Date.now();

  return (
    <>
      <Navbar />

      <section className="lookup-page">
        <div className="lookup-heading">
          <span>YOUR RESERVATIONS</span>
          <h1>Manage Your Booking</h1>
          <p>Enter your booking reference and email to continue.</p>
        </div>

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

          {error && <p className="booking-error">{error}</p>}

          <button
            type="submit"
            className="confirm-booking-button"
            disabled={loading}
          >
            {loading ? "Searching..." : "Find My Booking"}
          </button>
        </form>

        {message && <p className="success-message">{message}</p>}

        {booking && (
          <div className="lookup-result">
            <div className="result-header">
              <div>
                <span>BOOKING REFERENCE</span>
                <h2>{booking.booking_reference}</h2>
              </div>

              <span className={`booking-status ${booking.status.toLowerCase()}`}>
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

            <div className="result-dates">
              <div>
                <span>CHECK-IN</span>
                <strong>{formatDate(booking.check_in)}</strong>
              </div>

              <div>
                <span>CHECK-OUT</span>
                <strong>{formatDate(booking.check_out)}</strong>
              </div>
            </div>

            <div className="result-summary">
              <p>Total Nights: <strong>{booking.total_nights}</strong></p>

              <p>
                Subtotal:
                <strong> ₹{Number(booking.subtotal).toLocaleString("en-IN")}</strong>
              </p>

              <p>
                Discount:
                <strong> ₹{Number(booking.discount_amount).toLocaleString("en-IN")}</strong>
              </p>

              <h3>
                <IndianRupee size={20} />
                {Number(booking.final_amount).toLocaleString("en-IN")}
              </h3>
            </div>

            {canCancel && (
              <button
                className="cancel-booking-button"
                onClick={handleCancel}
              >
                Cancel Booking
              </button>
            )}
          </div>
        )}
      </section>
    </>
  );
}

export default BookingLookupPage;
