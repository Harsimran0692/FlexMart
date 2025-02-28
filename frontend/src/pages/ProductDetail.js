import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../style/ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  // Static product data (replace with API call in real implementation)
  const products = {
    15: {
      id: 15,
      name: "Classic Crew Neck T-Shirt",
      image: "https://via.placeholder.com/500x500?text=Classic+T-Shirt",
      price: 19.99,
      description:
        "Soft and durable cotton t-shirt for everyday wear. Perfect for casual outings or workouts, available in multiple sizes and colors.",
      rating: 4,
      isAvailable: true, // Availability status
      specs: {
        material: "100% Cotton",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "White", "Gray", "Navy"],
        care: "Machine washable, tumble dry low",
      },
      reviews: [
        {
          id: 1,
          user: "John Doe",
          rating: 5,
          comment: "Great quality and fits perfectly!",
        },
        {
          id: 2,
          user: "Jane Smith",
          rating: 4,
          comment: "Comfortable, but slightly tight in the sleeves.",
        },
        {
          id: 3,
          user: "Mike Johnson",
          rating: 4,
          comment: "Love the color options, very durable.",
        },
      ],
    },
    16: {
      id: 16,
      name: "Graphic Print T-Shirt",
      image: "https://via.placeholder.com/500x500?text=Graphic+T-Shirt",
      price: 24.99,
      description:
        "Bold graphic design on premium fabric. Ideal for fans of unique styles, available in various sizes and vibrant colors.",
      rating: 5,
      isAvailable: true,
      specs: {
        material: "95% Cotton, 5% Spandex",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Red", "Blue", "Green", "Yellow"],
        care: "Machine wash cold, hang dry",
      },
      reviews: [
        {
          id: 1,
          user: "Sarah Lee",
          rating: 5,
          comment: "Amazing design, very comfortable!",
        },
        {
          id: 2,
          user: "Tom Wilson",
          rating: 5,
          comment: "Best t-shirt I’ve ever bought, true to size.",
        },
      ],
    },
    17: {
      id: 17,
      name: "Slim Fit T-Shirt",
      image: "https://via.placeholder.com/500x500?text=Slim+T-Shirt",
      price: 22.99,
      description:
        "Sleek, slim-fit t-shirt for a modern look. Perfect for fashion-forward individuals, available in multiple sizes.",
      rating: 4,
      isAvailable: false, // Not available for demo
      specs: {
        material: "98% Cotton, 2% Elastane",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "White", "Charcoal"],
        care: "Machine wash warm, tumble dry low",
      },
      reviews: [
        {
          id: 1,
          user: "Emma Brown",
          rating: 4,
          comment: "Fits well, looks stylish.",
        },
        {
          id: 2,
          user: "David Chen",
          rating: 3,
          comment: "Good fit but fabric could be softer.",
        },
      ],
    },
    18: {
      id: 18,
      name: "V-Neck T-Shirt",
      image: "https://via.placeholder.com/500x500?text=V-Neck+T-Shirt",
      price: 18.99,
      description:
        "Comfortable and stylish v-neck t-shirt. Ideal for casual wear, available in various sizes and colors.",
      rating: 3,
      isAvailable: true,
      specs: {
        material: "100% Cotton",
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Black", "Red"],
        care: "Machine wash cold, hang dry",
      },
      reviews: [
        {
          id: 1,
          user: "Lisa Kim",
          rating: 3,
          comment: "Okay quality, but the v-neck is a bit deep.",
        },
        {
          id: 2,
          user: "Robert Lee",
          rating: 3,
          comment: "Good value for the price, but not premium.",
        },
      ],
    },
    19: {
      id: 19,
      name: "Long Sleeve T-Shirt",
      image: "https://via.placeholder.com/500x500?text=Long+Sleeve+T-Shirt",
      price: 29.99,
      description:
        "Warm, long-sleeve t-shirt for cooler days. Stylish and comfortable, available in multiple sizes.",
      rating: 4,
      isAvailable: true,
      specs: {
        material: "95% Cotton, 5% Polyester",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Gray", "Black", "Navy"],
        care: "Machine wash warm, tumble dry low",
      },
      reviews: [
        {
          id: 1,
          user: "Anna Patel",
          rating: 4,
          comment: "Very cozy, great for winter.",
        },
        {
          id: 2,
          user: "James Taylor",
          rating: 4,
          comment: "Fits well, keeps me warm.",
        },
      ],
    },
    20: {
      id: 20,
      name: "Athletic T-Shirt",
      image: "https://via.placeholder.com/500x500?text=Athletic+T-Shirt",
      price: 27.99,
      description:
        "Breathable t-shirt for active lifestyles. Perfect for workouts, available in multiple sizes.",
      rating: 5,
      isAvailable: true,
      specs: {
        material: "90% Polyester, 10% Spandex",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Blue", "Green"],
        care: "Machine wash cold, hang dry",
      },
      reviews: [
        {
          id: 1,
          user: "Sophie Green",
          rating: 5,
          comment: "Perfect for workouts, very breathable!",
        },
        {
          id: 2,
          user: "Mark Davis",
          rating: 5,
          comment: "Great fit, excellent material for sports.",
        },
      ],
    },
  };

  useEffect(() => {
    // Simulate API call with static data
    const selectedProduct = products[id];
    setProduct(selectedProduct);
  }, [id]);

  const [cart, setCart] = useState([]); // Simple cart state for demo
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product?.specs.colors[0] || ""
  );
  const [selectedSize, setSelectedSize] = useState(
    product?.specs.sizes[0] || ""
  );

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

  if (!product) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="product-detail-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">
          Home
        </Link>
        <span className="breadcrumb-separator">›</span>
        <Link to="/categories" className="breadcrumb-link">
          Categories
        </Link>
        <span className="breadcrumb-separator">›</span>
        <Link to={`/categories/clothing`} className="breadcrumb-link">
          Clothing
        </Link>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">{product.name}</span>
      </div>

      {/* Product Detail */}
      <div className="content-wrapper">
        <div className="product-images">
          <img src={product.image} alt={product.name} className="main-image" />
          <div className="thumbnail-images">
            <img
              src={product.image}
              alt={`${product.name} thumbnail`}
              className="thumbnail"
            />
            <img
              src={product.image}
              alt={`${product.name} thumbnail`}
              className="thumbnail"
            />
            <img
              src={product.image}
              alt={`${product.name} thumbnail`}
              className="thumbnail"
            />
          </div>
        </div>
        <div className="product-details">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-rating">
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={i < product.rating ? "star filled" : "star"}
              >
                ★
              </span>
            ))}
            <span className="rating-count">
              ({product.rating * 47} ratings)
            </span>
          </div>
          <p className="availability">
            {product.isAvailable ? "In Stock" : "Currently Unavailable"}
          </p>
          <p className="product-price">
            <span className="currency">$</span>
            <span className="price-main">{Math.floor(product.price)}</span>
            <span className="price-decimal">
              {product.price.toFixed(2).split(".")[1]}
            </span>
          </p>
          <p className="product-description">{product.description}</p>
          <div className="product-specs">
            <h3>Specifications</h3>
            <ul>
              <li>Material: {product.specs.material}</li>
              <li>Sizes Available: {product.specs.sizes.join(", ")}</li>
              <li>Colors: {product.specs.colors.join(", ")}</li>
              <li>Care Instructions: {product.specs.care}</li>
            </ul>
          </div>
          <div className="product-options">
            <div className="option-group">
              <label htmlFor="color">Color:</label>
              <select
                id="color"
                value={selectedColor}
                onChange={handleColorChange}
                className="option-dropdown"
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
                className="option-dropdown"
              >
                {product.specs.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="quantity-selector">
            <label htmlFor="quantity">Qty:</label>
            <select
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              className="quantity-dropdown"
            >
              {[1, 2, 3, 4, 5].map((qty) => (
                <option key={qty} value={qty}>
                  {qty}
                </option>
              ))}
            </select>
          </div>
          <div className="product-actions">
            <button
              className="add-to-cart-btn"
              onClick={() => handleAddToCart(product)}
              disabled={!product.isAvailability}
            >
              Add to Cart
            </button>
            <button className="buy-now-btn" disabled={!product.isAvailable}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="reviews-section">
        <h2>Customer Reviews</h2>
        {product.reviews.map((review) => (
          <div key={review.id} className="review">
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
        ))}
      </section>
    </div>
  );
}

export default ProductDetail;
