import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/DealsSection.css";
import ProductCard from "./ProductCard";

function DealsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  const deals = [
    {
      id: 1,
      name: "Smartphone",
      image: "https://via.placeholder.com/300x300?text=Smartphone",
    },
    {
      id: 2,
      name: "Sneakers",
      image: "https://via.placeholder.com/300x300?text=Sneakers",
    },
    {
      id: 3,
      name: "Smartwatch",
      image: "https://via.placeholder.com/300x300?text=Smartwatch",
    },
    {
      id: 4,
      name: "Headphones",
      image: "https://via.placeholder.com/300x300?text=Headphones",
    },
  ];

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
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const slidesToShow = 3;

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
          Ends in: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </div>
      </div>

      <div className="deals-carousel">
        <button
          className="carousel-btn prev"
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          ❮
        </button>
        <div className="carousel-content">
          {deals
            .slice(
              currentSlide * slidesToShow,
              (currentSlide + 1) * slidesToShow
            )
            .map((deal) => (
              <Link to={`/product/${deal.id}`} key={deal.id}>
                <ProductCard product={deal} />
              </Link>
            ))}
        </div>
        <button
          className="carousel-btn next"
          onClick={nextSlide}
          disabled={currentSlide >= Math.ceil(deals.length / slidesToShow) - 1}
        >
          ❯
        </button>
      </div>

      <div className="deals-grid">
        {deals.map((deal) => (
          <Link to={`/product/${deal.id}`} key={deal.id}>
            <ProductCard product={deal} />
          </Link>
        ))}
      </div>

      <Link to="/deals" className="view-all-deals">
        See All Deals →
      </Link>
    </section>
  );
}

export default DealsSection;
