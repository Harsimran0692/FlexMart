import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import "../style/ProductPage.css";

function ProductPage({
  products,
  loading,
  error,
  category,
  subcategory,
  fetchProducts,
}) {
  return (
    <div className="product-page-wrapper">
      {/* Breadcrumb */}
      <div className="product-breadcrumb">
        <Link to="/" className="breadcrumb-item">
          Home
        </Link>
        <span className="breadcrumb-divider">›</span>
        <Link to="/categories" className="breadcrumb-item">
          Categories
        </Link>
        <span className="breadcrumb-divider">›</span>
        <Link to={`/categories/${category}`} className="breadcrumb-item">
          {category}
        </Link>
        <span className="breadcrumb-divider">›</span>
        <span className="breadcrumb-active">{subcategory}</span>
      </div>

      {/* Main Content */}
      <main className="product-main">
        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : error ? (
          <div className="error-state">
            {error} <button onClick={fetchProducts}>Retry</button>
          </div>
        ) : products.length === 0 ? (
          <div className="no-products-state">
            No products found for "{subcategory}"
          </div>
        ) : (
          <>
            <section className="product-hero">
              <h1>
                {subcategory} in {category}
              </h1>
              <p>Explore top picks and deals in {subcategory.toLowerCase()}</p>
            </section>
            <section className="product-grid-container">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  subcategory={subcategory}
                />
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

const fetchProducts = async (
  setProducts,
  setLoading,
  setError,
  API_URL,
  subcategory
) => {
  try {
    setLoading(true);
    setError(null);
    const response = await axios.get(
      `${API_URL}/products/${subcategory.split(" ").join("").toLowerCase()}`
    );
    // console.log("API Response:", response.data);
    const fetchedProducts = response.data.data || response.data;
    setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
  } catch (err) {
    setError("Failed to fetch products");
  } finally {
    setLoading(false);
  }
};

export default function WrappedProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { category, subcategory } = useParams();
  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://flexmart-backend.onrender.com/api";

  useEffect(() => {
    fetchProducts(setProducts, setLoading, setError, API_URL, subcategory);
  }, [API_URL, subcategory]);

  return (
    <ProductPage
      products={products}
      loading={loading}
      error={error}
      category={category}
      subcategory={subcategory}
      fetchProducts={() =>
        fetchProducts(setProducts, setLoading, setError, API_URL, subcategory)
      }
    />
  );
}
