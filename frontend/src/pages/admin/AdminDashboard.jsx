
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  TicketPercent,
  LogOut,
  Hotel,
  Plus,
  Users,
  LayoutDashboard,
} from "lucide-react";

import "./AdminDashboard.css";

import {
  getAllCoupons,
  createCoupon,
} from "../../services/couponService";

import CreateCouponForm from "./CreateCouponForm";

function AdminDashboard() {
  const navigate = useNavigate();

  // Coupon data
  const [coupons, setCoupons] = useState([]);

  // Loading states
  const [loadingStats, setLoadingStats] = useState(true);
  const [creatingCoupon, setCreatingCoupon] = useState(false);

  // Form visibility
  const [showCouponForm, setShowCouponForm] = useState(false);

  // Messages
  const [couponMessage, setCouponMessage] = useState("");
  const [couponError, setCouponError] = useState("");

  // Fetch all coupons
  const fetchCoupons = async () => {
    try {
      const response = await getAllCoupons();
      setCoupons(response.data || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setCouponError("Unable to load coupons.");
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Dashboard statistics
  const totalCoupons = coupons.length;

  const activeCoupons = coupons.filter(
    (coupon) =>
      coupon.is_active === 1 ||
      coupon.is_active === true ||
      coupon.is_active === "1"
  ).length;

  const totalRedemptions = coupons.reduce(
    (total, coupon) =>
      total + Number(coupon.usage_count || 0),
    0
  );

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  // Open create coupon form
  const handleOpenCouponForm = () => {
    setCouponError("");
    setCouponMessage("");
    setShowCouponForm(true);
  };

  // Create coupon
  const handleCreateCoupon = async (formData) => {
    try {
      setCreatingCoupon(true);
      setCouponError("");
      setCouponMessage("");

      const couponData = {
        code: formData.code,
        description: formData.description,
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        maxDiscount: formData.maxDiscount,
        minBookingAmount: formData.minBookingAmount,
        usageLimit: formData.usageLimit,
        startDate: formData.startDate,
        expiryDate: formData.expiryDate,
      };

      await createCoupon(couponData);

      // Refresh coupon list and statistics
      await fetchCoupons();

      setShowCouponForm(false);
      setCouponMessage("Coupon created successfully!");

    } catch (error) {
      setCouponError(
        error.response?.data?.message ||
        "Unable to create coupon. Please try again."
      );
    } finally {
      setCreatingCoupon(false);
    }
  };

  return (
    <div className="admin-dashboard">

      {/* Header */}
      <header className="admin-header">
        <div className="admin-brand">
          <Hotel size={26} />
          <h2>StayEase</h2>
          <span>ADMIN PANEL</span>
        </div>

        <button
          className="admin-logout"
          onClick={handleLogout}
        >
          <LogOut size={17} />
          Logout
        </button>
      </header>

      <main className="admin-content">

        {/* Page Heading */}
        <section className="admin-welcome">
          <div>
            <h1>Welcome back, Admin!</h1>
            <p>
              Manage your StayEase coupon offers from one place.
            </p>
          </div>
        </section>

        {/* Dashboard Overview */}
        <section className="admin-overview">
          <h2>
            <LayoutDashboard size={21} />
            Dashboard Overview
          </h2>

          <div className="dashboard-cards">

            {/* Total Coupons */}
            <div className="dashboard-card">
              <div className="dashboard-card-icon">
                <TicketPercent />
              </div>

              <p>Total Coupons</p>

              <h3>
                {loadingStats ? "..." : totalCoupons}
              </h3>
            </div>

            {/* Active Coupons */}
            <div className="dashboard-card">
              <div className="dashboard-card-icon">
                <Hotel />
              </div>

              <p>Active Coupons</p>

              <h3>
                {loadingStats ? "..." : activeCoupons}
              </h3>
            </div>

            {/* Total Redemptions */}
            <div className="dashboard-card">
              <div className="dashboard-card-icon">
                <Users />
              </div>

              <p>Total Redemptions</p>

              <h3>
                {loadingStats ? "..." : totalRedemptions}
              </h3>
            </div>

          </div>
        </section>

        {/* Coupon Management */}
        <section className="coupon-management">

          <div className="coupon-section-heading">

            <div>
              <h2>Coupon Management</h2>
              <p>
                Create and manage promotional offers.
              </p>
            </div>

            <button
              className="create-coupon-button"
              onClick={handleOpenCouponForm}
            >
              <Plus size={18} />
              Create Coupon
            </button>

          </div>

          {/* Success Message */}
          {couponMessage && (
            <p className="coupon-success-message">
              {couponMessage}
            </p>
          )}

          {/* Error Message */}
          {couponError && (
            <p className="coupon-error-message">
              {couponError}
            </p>
          )}

          {/* Coupon Table */}
          <div className="coupon-table-container">

            {loadingStats ? (
              <p className="coupon-loading">
                Loading coupons...
              </p>
            ) : coupons.length === 0 ? (

              <div className="coupon-placeholder">
                <TicketPercent size={35} />
                <h3>No Coupons Found</h3>
                <p>
                  Create your first coupon to get started.
                </p>
              </div>

            ) : (

              <table className="coupon-table">

                <thead>
                  <tr>
                    <th>Coupon Code</th>
                    <th>Discount</th>
                    <th>Usage</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {coupons.map((coupon) => (

                    <tr key={coupon.id}>

                      <td>
                        <strong>{coupon.code}</strong>
                      </td>

                      <td>
                        {coupon.discount_type === "PERCENTAGE"
                          ? `${Number(coupon.discount_value)}%`
                          : `₹${Number(coupon.discount_value)}`}
                      </td>

                      <td>
                        {coupon.usage_count} / {coupon.usage_limit}
                      </td>

                      <td>
                        {new Date(
                          coupon.expiry_date
                        ).toLocaleDateString("en-IN")}
                      </td>

                      <td>
                        <span
                          className={`coupon-status ${
                            coupon.is_active
                              ? "status-active"
                              : "status-inactive"
                          }`}
                        >
                          {coupon.is_active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                    </tr>

                  ))}
                </tbody>

              </table>

            )}

          </div>

        </section>

      </main>

      {/* Create Coupon Form */}
      {showCouponForm && (
        <CreateCouponForm
          onClose={() => setShowCouponForm(false)}
          onSubmit={handleCreateCoupon}
          loading={creatingCoupon}
        />
      )}

    </div>
  );
}

export default AdminDashboard;
