import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../style/Hero.css";

function Hero() {
  const [deals, setDeals] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/products?deal=true`, {
          timeout: 10000, // Prevent hanging requests
          headers: {
            Accept: "application/json",
          },
        });
        const dealProducts = response.data.slice(0, 3); // Limit to 3 for the carousel
        console.log("Fetched deals with images:", dealProducts); // Log images for debugging
        setDeals(dealProducts);
        setError(null);
      } catch (err) {
        console.error(
          "Error fetching deals:",
          err.response?.data || err.message
        );
        setError("Failed to load deals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % deals.length);
    }, 5000); // Change slide every 5 seconds

    return () => {
      clearInterval(slideInterval);
    };
  }, [API_URL, deals.length]);

  if (loading) {
    return (
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to FlexMart</h1>
          <p>Unbeatable deals on everything you need.</p>
        </div>
        <div className="deals-carousel">
          <div className="carousel-container">
            <div className="loading">Loading deals...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to FlexMart</h1>
          <p>Unbeatable deals on everything you need.</p>
        </div>
        <div className="deals-carousel">
          <div className="carousel-container">
            <div className="error">{error}</div>
          </div>
        </div>
      </section>
    );
  }

  if (deals.length === 0) {
    return (
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to FlexMart</h1>
          <p>Unbeatable deals on everything you need.</p>
        </div>
        <div className="deals-carousel">
          <div className="carousel-container">
            <div className="no-deals">No deals available at the moment.</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Welcome to FlexMart</h1>
        <p>Unbeatable deals on everything you need.</p>
      </div>

      <div className="deals-carousel">
        <div className="carousel-container">
          {deals.map((deal, index) => (
            <Link
              key={deal._id}
              to={`/product/${deal._id}`}
              className={`carousel-slide ${
                index === currentSlide ? "active" : ""
              }`}
              aria-label={`View ${deal.name}`}
            >
              <img
                src={deal.image}
                alt={deal.name}
                onError={(e) => {
                  console.error("Image failed to load:", deal.image);
                  e.target.src =
                    "https://via.placeholder.com/1400x300?text=Deal+Image"; // Fallback image
                  e.target.className = "fallback-image"; // Add class for fallback styling
                }}
              />
              {/* <div className="deal-overlay">
                <h3>
                  {deal.name} - ${deal.price.toFixed(2)}
                </h3>
              </div> */}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
