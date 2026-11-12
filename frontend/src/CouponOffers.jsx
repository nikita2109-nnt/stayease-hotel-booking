
import { useEffect, useState } from "react";
import { TicketPercent, ChevronRight, Check } from "lucide-react";
import { getAvailableCoupons } from "../services/couponService";

function CouponOffers({ subtotal, appliedCoupon, onApply, onRemove }) {
  const [coupons, setCoupons] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await getAvailableCoupons();
        setCoupons(response.data || []);
      } catch (error) {
        console.error("Unable to fetch coupons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const getDiscountText = (coupon) => {
    if (coupon.discount_type === "PERCENTAGE") {
      return `${Number(coupon.discount_value)}% OFF`;
    }

    return `₹${Number(coupon.discount_value)} OFF`;
  };

  const getSavings = (coupon) => {
    let discount =
      coupon.discount_type === "PERCENTAGE"
        ? subtotal * Number(coupon.discount_value) / 100
        : Number(coupon.discount_value);

    if (coupon.max_discount != null) {
      discount = Math.min(discount, Number(coupon.max_discount));
    }

    return Math.min(discount, subtotal);
  };

  if (loading) return <p>Loading offers...</p>;

  if (coupons.length === 0) return null;

  const visibleCoupons = showAll ? coupons : coupons.slice(0, 1);

  return (
    <section className="coupon-offers">

      <div className="coupon-offer-header">
        <TicketPercent size={24} />

        <div>
          <h3>
            {appliedCoupon
              ? `You're saving ₹${getSavings(appliedCoupon).toLocaleString("en-IN")}`
              : "Available Offers"}
          </h3>

          <p>Apply a coupon and save on your stay</p>
        </div>
      </div>

      {appliedCoupon && (
        <div className="applied-coupon">
          <Check size={18} />
          <span>{appliedCoupon.code} applied</span>

          <button type="button" onClick={onRemove}>
            Remove
          </button>
        </div>
      )}

      {!appliedCoupon && visibleCoupons.map((coupon) => {
        const eligible = subtotal >= Number(coupon.min_booking_amount);

        return (
          <div className="coupon-offer-card" key={coupon.id}>
            <div>
              <strong>{coupon.code}</strong>
              <p>{getDiscountText(coupon)}</p>

              <small>
                {coupon.description ||
                  `Minimum booking ₹${Number(coupon.min_booking_amount).toLocaleString("en-IN")}`}
              </small>

              {coupon.max_discount != null && (
                <small>
                  Maximum savings ₹{Number(coupon.max_discount).toLocaleString("en-IN")}
                </small>
              )}

              <small>
                You save up to ₹{getSavings(coupon).toLocaleString("en-IN")}
              </small>
            </div>

            <button
              type="button"
              disabled={!eligible}
              onClick={() => onApply(coupon)}
            >
              APPLY
            </button>
          </div>
        );
      })}

      {!appliedCoupon && coupons.length > 1 && (
        <button
          type="button"
          className="view-coupons-button"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show less" : "View all coupons"}
          <ChevronRight size={18} />
        </button>
      )}
    </section>
  );
}

export default CouponOffers;
