import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/Home.css";
import Hero from "../components/Hero";
import CategoryBar from "../components/CategoryBar";
import ProductCard from "../components/ProductCard";
import DealsSection from "../components/DealsSection";

function ProductSection({ category, products, categoryLink }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesToShow = 3; // Show 3 products at a time for desktop

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev < Math.ceil(products.length / slidesToShow) - 1 ? prev + 1 : 0
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev > 0 ? prev - 1 : Math.ceil(products.length / slidesToShow) - 1
    );
  };

  return (
    <div className="product-section">
      <h3>{category}</h3>
      <div className="carousel-wrapper">
        <button
          className="carousel-btn prev"
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          ❮
        </button>
        <div className="carousel-content">
          {products
            .slice(
              currentSlide * slidesToShow,
              (currentSlide + 1) * slidesToShow
            )
            .map((product) => (
              <Link to={`/product/${product.id}`} key={product.id}>
                <ProductCard product={product} />
              </Link>
            ))}
        </div>
        <button
          className="carousel-btn next"
          onClick={nextSlide}
          disabled={
            currentSlide >= Math.ceil(products.length / slidesToShow) - 1
          }
        >
          ❯
        </button>
      </div>
      <div className="grid-content">
        {products.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id}>
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
      <Link to={categoryLink} className="view-more-link" state={{ category }}>
        See more {category} →
      </Link>
    </div>
  );
}

function Home() {
  const [category] = useState({
    electronics: [
      {
        id: 1,
        name: "Laptop",
        image: "https://via.placeholder.com/300x300?text=Laptop",
      },
      {
        id: 2,
        name: "Headphones",
        image: "https://via.placeholder.com/300x300?text=Headphones",
      },
      {
        id: 3,
        name: "Mouse",
        image: "https://via.placeholder.com/300x300?text=Mouse",
      },
      {
        id: 4,
        name: "Keyboard",
        image: "https://via.placeholder.com/300x300?text=Keyboard",
      },
    ],
    toys: [
      {
        id: 5,
        name: "Action Figure",
        image: "https://via.placeholder.com/300x300?text=Action+Figure",
      },
      {
        id: 6,
        name: "Puzzle",
        image: "https://via.placeholder.com/300x300?text=Puzzle",
      },
      {
        id: 7,
        name: "Lego Set",
        image: "https://via.placeholder.com/300x300?text=Lego",
      },
      {
        id: 8,
        name: "Doll",
        image: "https://via.placeholder.com/300x300?text=Doll",
      },
    ],
    books: [
      {
        id: 9,
        name: "Novel",
        image: "https://via.placeholder.com/300x300?text=Novel",
      },
      {
        id: 10,
        name: "Textbook",
        image: "https://via.placeholder.com/300x300?text=Textbook",
      },
      {
        id: 11,
        name: "Comic",
        image: "https://via.placeholder.com/300x300?text=Comic",
      },
      {
        id: 12,
        name: "Cookbook",
        image: "https://via.placeholder.com/300x300?text=Cookbook",
      },
    ],
    clothing: [
      {
        id: 13,
        name: "T-Shirt",
        image: "https://via.placeholder.com/300x300?text=T-Shirt",
      },
      {
        id: 14,
        name: "Jacket",
        image: "https://via.placeholder.com/300x300?text=Jacket",
      },
      {
        id: 15,
        name: "Jeans",
        image: "https://via.placeholder.com/300x300?text=Jeans",
      },
      {
        id: 16,
        name: "Hat",
        image: "https://via.placeholder.com/300x300?text=Hat",
      },
    ],
  });

  return (
    <main>
      <Hero />
      <CategoryBar />
      <DealsSection />
      <section className="products-section">
        <ProductSection
          category="Electronics"
          products={category.electronics}
          categoryLink="/category/electronics"
        />
        <ProductSection
          category="Toys"
          products={category.toys}
          categoryLink="/category/toys"
        />
        <ProductSection
          category="Books"
          products={category.books}
          categoryLink="/category/books"
        />
        <ProductSection
          category="Clothing"
          products={category.clothing}
          categoryLink="/category/clothing"
        />
      </section>
    </main>
  );
}

export default Home;
