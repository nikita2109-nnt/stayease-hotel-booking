
import { Link, useNavigate } from "react-router-dom";
import { Hotel, Menu, LayoutDashboard } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const handleAdminDashboard = () => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      navigate("/admin/dashboard");
    } else {
      navigate("/admin/login");
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <Hotel size={26} />
        <span>StayEase</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/hotels">Explore Hotels</Link>
        <Link to="/my-booking">My Booking</Link>
      </div>

      <div className="nav-actions">
        <button
          className="admin-nav-button"
          onClick={handleAdminDashboard}
        >
          <LayoutDashboard size={17} />
          Admin Dashboard
        </button>

        <Link to="/hotels" className="nav-button">
          Book a Stay
        </Link>
      </div>

      <button className="menu-button" aria-label="Open menu">
        <Menu size={24} />
      </button>
    </nav>
  );
}

export default Navbar;
