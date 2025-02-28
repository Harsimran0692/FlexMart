import React, { useState, useEffect } from "react";
import "../style/Hero.css";

// Sample deals data (you can replace with real data)
const deals = [
  {
    id: 1,
    image: "deal1.jpg",
    title: "50% Off Electronics",
    link: "/electronics",
  },
  { id: 2, image: "deal2.jpg", title: "30% Off Fashion", link: "/fashion" },
  { id: 3, image: "deal3.jpg", title: "70% Off Home", link: "/home" },
];

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % deals.length);
    }, 5000); // Change slide every 5 seconds

    return () => {
      clearInterval(slideInterval);
    };
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % deals.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + deals.length) % deals.length);
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Welcome to FlexMart</h1>
        <p>Unbeatable deals on everything you need.</p>
      </div>

      <div className="deals-carousel">
        <div className="carousel-container">
          {deals.map((deal, index) => (
            <a
              key={deal.id}
              href={deal.link}
              className={`carousel-slide ${
                index === currentSlide ? "active" : ""
              }`}
            >
              <img src={deal.image} alt={deal.title} />
              <div className="deal-overlay">
                <h3>{deal.title}</h3>
              </div>
            </a>
          ))}

          {/* Navigation Buttons */}
          <button className="carousel-btn prev" onClick={prevSlide}>
            &#10094;
          </button>
          <button className="carousel-btn next" onClick={nextSlide}>
            &#10095;
          </button>

          {/* Dots Navigation */}
          <div className="carousel-dots">
            {deals.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => {
                  setCurrentSlide(index);
                }}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
