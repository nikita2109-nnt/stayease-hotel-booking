
import { Link } from "react-router-dom";
import { Hotel, Menu } from "lucide-react";

function Navbar() {
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

      <Link to="/hotels" className="nav-button">
        Book a Stay
      </Link>

      <button className="menu-button" aria-label="Open menu">
        <Menu size={24} />
      </button>
    </nav>
  );
}

export default Navbar;
