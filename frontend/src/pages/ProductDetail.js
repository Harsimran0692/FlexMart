import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../style/ProductDetail.css";

function ProductDetail() {
  const { subcategory, id } = useParams(); // Updated to include subcategory from route
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_URL}/products/test/${id}`);
        const fetchedProduct = response.data.data || response.data;
        setProduct(fetchedProduct);
        // Set initial color and size from product specs
        setSelectedColor(fetchedProduct.specs.colors[0] || "");
        setSelectedSize(fetchedProduct.specs.sizes[0] || "");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, API_URL]);

  const handleAddToCart = (product) => {
    if (!product.isAvailable) {
      alert("This product is currently not available.");
      return;
    }
    setCart([
      ...cart,
      { ...product, quantity, color: selectedColor, size: selectedSize },
    ]);
    alert(
      `${product.name} (Color: ${selectedColor}, Size: ${selectedSize}) has been added to your cart!`
    );
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value) || 1);
  };

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  return (
    <div className="product-detail-wrapper">
      {/* Breadcrumb */}
      <div className="product-detail-breadcrumb">
        <Link to="/" className="breadcrumb-item">
          Home
        </Link>
        <span className="breadcrumb-divider">›</span>
        <Link to="/categories" className="breadcrumb-item">
          Categories
        </Link>
        <span className="breadcrumb-divider">›</span>
        <Link
          to={`/categories/${product?.category}`}
          className="breadcrumb-item"
        >
          {product?.category || "Loading..."}
        </Link>
        <span className="breadcrumb-divider">›</span>
        <Link
          to={`/categories/${product?.category}/${subcategory}`}
          className="breadcrumb-item"
        >
          {subcategory}
        </Link>
        <span className="breadcrumb-divider">›</span>
        <span className="breadcrumb-active">
          {product?.name || "Loading..."}
        </span>
      </div>

      {/* Main Content */}
      <main className="product-detail-main">
        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : !product ? (
          <div className="no-product-state">Product not found</div>
        ) : (
          <div className="product-detail-content">
            <div className="product-images-section">
              <img
                src={product.image}
                alt={product.name}
                className="product-main-image"
              />
              <div className="product-thumbnails">
                {[product.image, product.image, product.image].map(
                  (img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="product-thumbnail"
                    />
                  )
                )}
              </div>
            </div>
            <div className="product-info-section">
              <h1 className="product-detail-title">{product.name}</h1>
              <div className="product-detail-rating">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={
                      i < Math.floor(product.rating) ? "star filled" : "star"
                    }
                  >
                    ★
                  </span>
                ))}
                <span className="rating-count">
                  ({product.rating * 47} ratings)
                </span>
              </div>
              <p className="product-availability">
                {product.isAvailable ? "In Stock" : "Currently Unavailable"}
              </p>
              <p className="product-detail-price">
                <span className="currency">$</span>
                <span className="price-main">{Math.floor(product.price)}</span>
                <span className="price-decimal">
                  .{product.price.toFixed(2).split(".")[1]}
                </span>
              </p>
              <p className="product-detail-description">
                {product.description}
              </p>
              <div className="product-options">
                <div className="option-group">
                  <label htmlFor="color">Color:</label>
                  <select
                    id="color"
                    value={selectedColor}
                    onChange={handleColorChange}
                    className="option-select"
                  >
                    {product.specs.colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="option-group">
                  <label htmlFor="size">Size:</label>
                  <select
                    id="size"
                    value={selectedSize}
                    onChange={handleSizeChange}
                    className="option-select"
                  >
                    {product.specs.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="option-group">
                  <label htmlFor="quantity">Quantity:</label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="option-select"
                  >
                    {[1, 2, 3, 4, 5].map((qty) => (
                      <option key={qty} value={qty}>
                        {qty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="product-actions">
                <button
                  className="add-to-cart-button"
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.isAvailable}
                >
                  Add to Cart
                </button>
                <button
                  className="buy-now-button"
                  disabled={!product.isAvailable}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Reviews Section */}
      {product && (
        <section className="product-reviews-section">
          <h2>Customer Reviews</h2>
          {product.reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet.</p>
          ) : (
            product.reviews.map((review, index) => (
              <div key={index} className="review-item">
                <div className="review-header">
                  <span className="review-user">{review.user}</span>
                  <div className="review-rating">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={i < review.rating ? "star filled" : "star"}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))
          )}
        </section>
      )}
    </div>
  );
}

export default ProductDetail;
