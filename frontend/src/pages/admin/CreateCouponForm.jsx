
import { useState } from "react";
import { X, TicketPercent } from "lucide-react";

function CreateCouponForm({ onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    maxDiscount: "",
    minBookingAmount: "0",
    usageLimit: "",
    startDate: "",
    expiryDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      code: formData.code.trim().toUpperCase(),
      discountValue: Number(formData.discountValue),
      maxDiscount: formData.maxDiscount
        ? Number(formData.maxDiscount)
        : null,
      minBookingAmount: Number(formData.minBookingAmount),
      usageLimit: Number(formData.usageLimit),
    });
  };

  return (
    <div className="coupon-form-overlay">
      <div className="coupon-form-card">

        <div className="coupon-form-header">
          <div>
            <div className="coupon-form-title">
              <TicketPercent size={22} />
              <h2>Create New Coupon</h2>
            </div>
            <p>Add a promotional offer for your customers.</p>
          </div>

          <button
            type="button"
            className="coupon-form-close"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="coupon-form-grid">

            <div className="coupon-field">
              <label>Coupon Code *</label>
              <input
                type="text"
                name="code"
                placeholder="e.g. SUMMER25"
                value={formData.code}
                onChange={handleChange}
                required
              />
            </div>

            <div className="coupon-field">
              <label>Description</label>
              <input
                type="text"
                name="description"
                placeholder="e.g. Special summer offer"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="coupon-field">
              <label>Discount Type *</label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                required
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (₹)</option>
              </select>
            </div>

            <div className="coupon-field">
              <label>Discount Value *</label>
              <input
                type="number"
                name="discountValue"
                placeholder="Enter discount"
                min="0.01"
                max={
                  formData.discountType === "PERCENTAGE"
                    ? "100"
                    : undefined
                }
                step="0.01"
                value={formData.discountValue}
                onChange={handleChange}
                required
              />
            </div>

            <div className="coupon-field">
              <label>Maximum Discount (₹)</label>
              <input
                type="number"
                name="maxDiscount"
                placeholder="Optional"
                min="0.01"
                step="0.01"
                value={formData.maxDiscount}
                onChange={handleChange}
              />
            </div>

            <div className="coupon-field">
              <label>Minimum Booking Amount (₹)</label>
              <input
                type="number"
                name="minBookingAmount"
                min="0"
                step="0.01"
                value={formData.minBookingAmount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="coupon-field">
              <label>Usage Limit *</label>
              <input
                type="number"
                name="usageLimit"
                placeholder="e.g. 100"
                min="1"
                step="1"
                value={formData.usageLimit}
                onChange={handleChange}
                required
              />
            </div>

            <div className="coupon-field">
              <label>Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="coupon-field">
              <label>Expiry Date *</label>
              <input
                type="date"
                name="expiryDate"
                min={formData.startDate || undefined}
                value={formData.expiryDate}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="coupon-form-actions">
            <button
              type="button"
              className="coupon-cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="coupon-save-button"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Coupon"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateCouponForm;
