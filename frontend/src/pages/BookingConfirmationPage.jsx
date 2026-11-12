
import { Link, useLocation } from "react-router-dom";
import { CheckCircle, CalendarDays, Ticket, IndianRupee } from "lucide-react";
import Navbar from "../components/Navbar";

function BookingConfirmationPage() {
  const { state } = useLocation();

  if (!state) {
    return (
      <>
        <Navbar />
        <div className="confirmation-page">
          <h2>No booking information found.</h2>
          <Link to="/hotels">Explore Hotels</Link>
        </div>
      </>
    );
  }

  const {
    bookingReference,
    totalNights,
    subtotal,
    couponCode,
    discountAmount,
    finalAmount,
  } = state;

  return (
    <>
      <Navbar />

      <section className="confirmation-page">
        <div className="confirmation-card">
          <CheckCircle className="success-icon" size={65} />

          <h1>Booking Confirmed!</h1>

          <p className="confirmation-message">
            Your reservation has been successfully completed.
          </p>

          <div className="booking-reference">
            <span>BOOKING REFERENCE</span>
            <h2>{bookingReference}</h2>
          </div>

          <div className="confirmation-details">
            <div>
              <CalendarDays />
              <span>Total Nights</span>
              <strong>{totalNights}</strong>
            </div>

            <div>
              <IndianRupee />
              <span>Subtotal</span>
              <strong>₹{Number(subtotal).toLocaleString("en-IN")}</strong>
            </div>

            <div>
              <Ticket />
              <span>Coupon Applied</span>
              <strong>{couponCode || "None"}</strong>
            </div>

            <div>
              <IndianRupee />
              <span>Discount</span>
              <strong>
                ₹{Number(discountAmount).toLocaleString("en-IN")}
              </strong>
            </div>
          </div>

          <div className="final-amount">
            <span>Final Amount</span>
            <h2>
              ₹{Number(finalAmount).toLocaleString("en-IN")}
            </h2>
          </div>

          <Link to="/" className="home-button">
            Back to Home
          </Link>
        </div>
      </section>
    </>
  );
}

export default BookingConfirmationPage;
