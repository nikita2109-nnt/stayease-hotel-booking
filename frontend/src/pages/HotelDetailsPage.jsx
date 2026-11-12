
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Wifi, Waves, Car, Wind } from "lucide-react";

import Navbar from "../components/Navbar";
import { getHotelById } from "../services/hotelService";

function HotelDetailsPage() {
  const { id } = useParams();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        setLoading(true);

        const response = await getHotelById(id);

        setHotel(response.data?.[0] || null);
      } catch (err) {
        console.error("Hotel details error:", err);
        setError("Unable to load hotel details.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id]);

  if (loading) return <p>Loading hotel details...</p>;

  if (error) return <p>{error}</p>;

  if (!hotel) return <p>Hotel not found.</p>;

  const amenityIcons = {
    "Free Wi-Fi": <Wifi size={18} />,
    "Swimming Pool": <Waves size={18} />,
    "Beach Access": <Waves size={18} />,
    Parking: <Car size={18} />,
    AC: <Wind size={18} />,
  };

  return (
    <>
      <Navbar />

      <section className="hotel-details-page">
        <div className="details-heading">
          <span>DISCOVER YOUR STAY</span>

          <h1>{hotel.hotel_name}</h1>

          <p>
            <MapPin size={17} />
            {hotel.location}
          </p>
        </div>

        <div className="details-image">
          <img
            src={hotel.image_url}
            alt={hotel.hotel_name}
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200";
            }}
          />
        </div>

        <div className="details-content">
          <div className="details-about">
            <h2>About This Hotel</h2>
            <p>{hotel.description}</p>

            <h2>Hotel Amenities</h2>

            <div className="amenities-list">
              {hotel.amenities?.map((amenity) => (
                <div className="amenity-item" key={amenity}>
                  {amenityIcons[amenity] || <Wifi size={18} />}
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="room-card">
            <span className="room-label">AVAILABLE ROOM</span>

            <h2>{hotel.room_name}</h2>

            <p>{hotel.total_rooms} rooms in total</p>

            <div className="room-price">
              ₹{Number(hotel.price_per_night).toLocaleString("en-IN")}
              <span> / night</span>
            </div>

            <Link
              to={`/booking/${hotel.room_type_id}`}
              className="book-room-button"
            >
              Book This Room
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default HotelDetailsPage;
