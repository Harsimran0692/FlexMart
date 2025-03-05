import React from "react";
import { Link } from "react-router-dom";
import "../style/ProductCard.css";

function ProductCard({ product }) {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "star filled" : "star"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card-link">
      <div className="product-card">
        <div className="product-image-container">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
        </div>
        <h4 className="product-name">{product.name}</h4>
        <p className="product-price">${product.price?.toFixed(2) || "N/A"}</p>
        <div className="product-rating">{renderStars(product.rating || 0)}</div>
        <span className="rating-count">
          ({(product.rating || 0) * 47} ratings)
        </span>
      </div>
    </Link>
  );
}

export default ProductCard;
