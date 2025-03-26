import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../style/Home.css";
import Hero from "../components/Hero";
import CategoryBar from "../components/CategoryBar";
import ProductCard from "../components/ProductCard";
import DealsSection from "../components/DealsSection";

function ProductSection({ category, products }) {
  // const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  console.log("category: ", category);

  return (
    <div className="product-section">
      <h2 className="category-title">{category.name}</h2>
      <div className="sub-sections-grid">
        {/* Display all types as sub-sections */}
        {category.type.map((type, index) => (
          <Link
            to={`/products/${category.name}/${type.name}`}
            key={type.name || index} // Use index as fallback if name is missing
            className="sub-section-card"
            aria-label={`Go to ${type.name} in ${category.name}`}
          >
            <img
              src={type.image}
              alt={type.name || `Type ${index + 1}`}
              className="sub-section-image"
              onError={(e) => {
                console.log(`Image failed for ${type.name}:`, e.target.src);
                e.target.src =
                  "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081";
                e.target.onerror = null; // Prevent infinite loops if fallback fails
              }}
            />
            <h3 className="sub-section-name">{type.name}</h3>
          </Link>
        ))}
      </div>
      <div className="products-grid">
        {products.slice(0, 4).map((product) => (
          <Link
            to={`/product/${product._id}`}
            key={product._id}
            className="product-link"
          >
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
      <Link
        to={`/categories/${category.name.split(" ").join("")}/${category._id}`}
        className="view-more-link"
      >
        See more {category.name} →
      </Link>
    </div>
  );
}

function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/categories`);
        console.log("API Response:", response.data); // Debug the response
        setCategories(response.data);
        setError(null);
      } catch (error) {
        console.error(
          "Error fetching categories:",
          error.response?.data || error.message || error
        );
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [API_URL]);

  if (loading) {
    return (
      <main>
        <div className="loading">Loading Home...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <div className="error">{error}</div>
      </main>
    );
  }

  // console.log("Categories in Home:", categories);

  return (
    <main>
      <Hero />
      <CategoryBar />
      <DealsSection />
      <section className="products-section">
        {categories.map((category) => (
          <ProductSection
            key={category._id}
            category={category}
            products={category.products || []} // Ensure products is an array or empty
          />
        ))}
      </section>
    </main>
  );
}

export default Home;
