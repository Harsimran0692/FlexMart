import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../style/ProductPage.css";

function ProductItem({ product, onAddToCart }) {
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
    <div className="product-item">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image-container">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
        </div>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          {renderStars(product.rating)}
          <span className="rating-count">({product.rating * 47})</span>
        </div>
        <p className="product-price">
          <span className="currency">$</span>
          <span className="price-main">{Math.floor(product.price)}</span>
          <span className="price-decimal">
            {product.price.toFixed(2).split(".")[1]}
          </span>
        </p>
        <p className="product-desc">{product.description}</p>
      </Link>
      <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
}

function ProductPage() {
  const { categoryName } = useParams();
  const displayCategory = categoryName
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    : "Category";

  const [products] = useState({
    clothing: [
      {
        id: 15,
        name: "Classic Crew Neck T-Shirt",
        image: "https://via.placeholder.com/300x300?text=Classic+T-Shirt",
        price: 19.99,
        description: "Soft and durable cotton t-shirt for everyday wear.",
        rating: 4,
      },
      {
        id: 16,
        name: "Graphic Print T-Shirt",
        image: "https://via.placeholder.com/300x300?text=Graphic+T-Shirt",
        price: 24.99,
        description: "Bold graphic design on premium fabric.",
        rating: 5,
      },
      {
        id: 17,
        name: "Slim Fit T-Shirt",
        image: "https://via.placeholder.com/300x300?text=Slim+T-Shirt",
        price: 22.99,
        description: "Sleek, slim-fit t-shirt for a modern look.",
        rating: 4,
      },
      {
        id: 18,
        name: "V-Neck T-Shirt",
        image: "https://via.placeholder.com/300x300?text=V-Neck+T-Shirt",
        price: 18.99,
        description: "Comfortable and stylish v-neck t-shirt.",
        rating: 3,
      },
      {
        id: 19,
        name: "Long Sleeve T-Shirt",
        image: "https://via.placeholder.com/300x300?text=Long+Sleeve+T-Shirt",
        price: 29.99,
        description: "Warm, long-sleeve t-shirt for cooler days.",
        rating: 4,
      },
      {
        id: 20,
        name: "Athletic T-Shirt",
        image: "https://via.placeholder.com/300x300?text=Athletic+T-Shirt",
        price: 27.99,
        description: "Breathable t-shirt for active lifestyles.",
        rating: 5,
      },
    ],
  });

  const [sortBy, setSortBy] = useState("default");
  const [cart, setCart] = useState([]); // Simple cart state for demo
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State for mobile filter toggle

  const categoryProducts = products[categoryName.toLowerCase()] || [];

  const sortedProducts = [...categoryProducts].sort((a, b) => {
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating-desc") return b.rating - a.rating;
    return 0;
  });

  const handleAddToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
    alert(`${product.name} has been added to your cart!`);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Ref for detecting clicks outside to close the filter
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isFilterOpen &&
        filterRef.current &&
        !filterRef.current.contains(event.target)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  return (
    <div className="product-page-container" ref={filterRef}>
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
        <span className="breadcrumb-current">{displayCategory}</span>
      </div>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-left">
          <select
            className="mobile-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Avg. Customer Review</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
        <div className="nav-actions">
          <button className="burger-menu" onClick={toggleFilter}>
            <span>☰</span>
          </button>
        </div>
      </nav>

      {/* Desktop Sort Bar */}
      <div className="sort-bar desktop-only">
        <label htmlFor="sort">Sort by:</label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="default">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Avg. Customer Review</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>

      {/* Mobile Filter Panel */}
      <div className={`mobile-filter-panel ${isFilterOpen ? "open" : ""}`}>
        <button className="close-filter-btn" onClick={toggleFilter}>
          Close
        </button>
        <aside className="sidebar">
          <h2 className="sidebar-title">Refine By</h2>
          <div className="filter-section">
            <h3>Price</h3>
            <ul>
              <li>
                <Link to="#">Under $20</Link>
              </li>
              <li>
                <Link to="#">$20 - $30</Link>
              </li>
              <li>
                <Link to="#">$30 - $50</Link>
              </li>
              <li>
                <Link to="#">$50 & Above</Link>
              </li>
            </ul>
          </div>
          <div className="filter-section">
            <h3>Customer Review</h3>
            <ul>
              <li>
                <Link to="#">4 Stars & Up</Link>
              </li>
              <li>
                <Link to="#">3 Stars & Up</Link>
              </li>
              <li>
                <Link to="#">2 Stars & Up</Link>
              </li>
            </ul>
          </div>
          <div className="filter-section">
            <h3>Size</h3>
            <ul>
              <li>
                <Link to="#">Small</Link>
              </li>
              <li>
                <Link to="#">Medium</Link>
              </li>
              <li>
                <Link to="#">Large</Link>
              </li>
              <li>
                <Link to="#">XL</Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Content Wrapper */}
      <div className="content-wrapper">
        {/* Desktop Sidebar Filters (hidden on mobile) */}
        <aside className="sidebar desktop-only">
          <h2 className="sidebar-title">Refine By</h2>
          <div className="filter-section">
            <h3>Price</h3>
            <ul>
              <li>
                <Link to="#">Under $20</Link>
              </li>
              <li>
                <Link to="#">$20 - $30</Link>
              </li>
              <li>
                <Link to="#">$30 - $50</Link>
              </li>
              <li>
                <Link to="#">$50 & Above</Link>
              </li>
            </ul>
          </div>
          <div className="filter-section">
            <h3>Customer Review</h3>
            <ul>
              <li>
                <Link to="#">4 Stars & Up</Link>
              </li>
              <li>
                <Link to="#">3 Stars & Up</Link>
              </li>
              <li>
                <Link to="#">2 Stars & Up</Link>
              </li>
            </ul>
          </div>
          <div className="filter-section">
            <h3>Size</h3>
            <ul>
              <li>
                <Link to="#">Small</Link>
              </li>
              <li>
                <Link to="#">Medium</Link>
              </li>
              <li>
                <Link to="#">Large</Link>
              </li>
              <li>
                <Link to="#">XL</Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <h1 className="page-title">
            {displayCategory} (1-24 of {categoryProducts.length} results)
          </h1>

          <div className="products-grid">
            {categoryProducts.length === 0 ? (
              <div className="no-products">
                <p>No results for "{displayCategory}".</p>
                <Link to="/" className="back-to-home">
                  Back to Home
                </Link>
              </div>
            ) : (
              sortedProducts.map((product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default ProductPage;
