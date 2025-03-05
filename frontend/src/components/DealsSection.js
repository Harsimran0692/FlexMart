import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../style/DealsSection.css";
import ProductCard from "./ProductCard";

function DealsSection() {
  const [deals, setDeals] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  function calculateTimeLeft() {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const difference = endOfDay - now;
    return {
      hours: Math.floor(difference / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  }

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        const dealProducts = response.data.slice(0, 6); // Limit to 6 for demo
        setDeals(dealProducts);
      } catch (error) {
        console.error("Error fetching deals:", error);
      }
    };

    fetchDeals();

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [API_URL]);

  const slidesToShow = window.innerWidth <= 768 ? 1 : 3;

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev < Math.ceil(deals.length / slidesToShow) - 1 ? prev + 1 : 0
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev > 0 ? prev - 1 : Math.ceil(deals.length / slidesToShow) - 1
    );
  };

  return (
    <section className="deals">
      <div className="deals-header">
        <h2>Today’s Deals</h2>
        <div className="countdown">
          <span>Ends in:</span>
          <span className="countdown-timer">
            {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </span>
        </div>
      </div>

      <div className="deals-carousel">
        <button
          className="carousel-btn prev"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          aria-label="Previous slide"
        >
          ❮
        </button>
        <div className="carousel-content">
          <div
            className="carousel-inner"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              transition: "transform 0.5s ease",
            }}
          >
            {deals.map((deal) => (
              <div
                key={deal._id}
                className="deal-link"
                style={{
                  flex: `0 0 ${100 / slidesToShow}%`,
                  maxWidth: `${100 / slidesToShow}%`,
                }}
              >
                <ProductCard product={deal} />
              </div>
            ))}
          </div>
        </div>
        <button
          className="carousel-btn next"
          onClick={nextSlide}
          disabled={currentSlide >= Math.ceil(deals.length / slidesToShow) - 1}
          aria-label="Next slide"
        >
          ❯
        </button>
      </div>

      <Link to="/deals" className="view-all-deals">
        See All Deals →
      </Link>
    </section>
  );
}

export default DealsSection;
