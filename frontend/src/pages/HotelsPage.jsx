
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { MapPin, Star, Wifi } from "lucide-react";

import Navbar from "../components/Navbar";
import { getHotels, searchHotels } from "../services/hotelService";

function HotelsPage() {
  const [searchParams] = useSearchParams();

  const location = searchParams.get("location") || "";

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError("");

        const response = location
          ? await searchHotels(location)
          : await getHotels();

        setHotels(response.data || []);
      } catch (err) {
        console.error("Hotel fetching error:", err);
        setError("Unable to load hotels. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [location]);

  return (
    <>
      <Navbar />

      <section className="hotels-page">
        <div className="hotels-heading">
          <span>DISCOVER YOUR NEXT STAY</span>

          <h1>
            {location
              ? `Hotels in ${location}`
              : "Explore Our Hotels"}
          </h1>

          <p>Find the perfect place for your next journey.</p>
        </div>

        {loading && <p>Loading hotels...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading && !error && hotels.length === 0 && (
          <p>No hotels found for this destination.</p>
        )}

        <div className="hotel-grid">
          {hotels.map((hotel) => (
            <div className="hotel-card" key={hotel.hotel_id}>
              <div className="hotel-image">
                <img
                  src={hotel.image_url}
                  alt={hotel.hotel_name}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
                  }}
                />
              </div>

              <div className="hotel-info">
                <h2>{hotel.hotel_name}</h2>

                <p className="hotel-location">
                  <MapPin size={15} />
                  {hotel.location}
                </p>

                <p className="hotel-description">
                  {hotel.description}
                </p>

                <div className="hotel-rating">
                  <Wifi size={16} />
                  <span>{hotel.amenities?.[0] || "Hotel Stay"}</span>
                </div>

                <p className="hotel-price">
                  ₹{Number(hotel.price_per_night).toLocaleString("en-IN")}
                  <span> / night</span>
                </p>

                <Link
                  to={`/hotels/${hotel.hotel_id}`}
                  className="hotel-view-button"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default HotelsPage;
