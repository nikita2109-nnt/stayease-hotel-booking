
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  CalendarDays,
  Users
} from "lucide-react";

import Navbar from "../components/Navbar";

function HomePage() {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    if (!location.trim() || !checkIn || !checkOut) {
      alert("Please enter destination and travel dates.");
      return;
    }

    if (checkOut <= checkIn) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    navigate(
      `/hotels?location=${encodeURIComponent(location.trim())}&checkIn=${checkIn}&checkOut=${checkOut}`
    );
  };

  return (
    <div className="home-page">
      <Navbar />

      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">YOUR JOURNEY, OUR STAY</span>

          <h1>
            Find Your Perfect
            <br />
            <span>Place to Stay.</span>
          </h1>

          <p>
            Discover comfortable stays, explore beautiful destinations
            and make every journey memorable with StayEase.
          </p>

          <Link to="/hotels" className="explore-button">
            Explore Hotels <Search size={18} />
          </Link>
        </div>
      </section>

      <form className="search-section" onSubmit={handleSearch}>
        <div className="search-item">
          <MapPin />
          <div>
            <label>Destination</label>
            <input
              type="text"
              placeholder="Where are you going?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="search-item">
          <CalendarDays />
          <div>
            <label>Check-in</label>
            <input
              type="date"
              value={checkIn}
              min={new Date().toLocaleDateString("en-CA")}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
        </div>

        <div className="search-item">
          <CalendarDays />
          <div>
            <label>Check-out</label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || new Date().toLocaleDateString("en-CA")}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>

        <div className="search-item">
          <Users />
          <div>
            <label>Guests</label>
            <p>1 Room, 2 Guests</p>
          </div>
        </div>

        <button type="submit" className="search-button">
          Search Hotels
        </button>
      </form>
    </div>
  );
}

export default HomePage;
