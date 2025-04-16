import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../style/Category.css";
import ProductCard from "../components/ProductCard";

function DetailedProductCard({ product }) {
  return (
    <div className="detailed-product-card">
      <img
        src={product.image}
        alt={product.name}
        className="detailed-product-image"
      />
      <div className="detailed-product-info">
        <h4>{product.name}</h4>
        <p className="price">${product.price.toFixed(2)}</p>
        <p className="description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <Link to={`/product/${product.id}`} className="view-details-btn">
          View Details
        </Link>
      </div>
    </div>
  );
}

function Category() {
  const { category } = useParams();

  const [sortBy, setSortBy] = useState("default");

  const categoryProducts = products[category.toLowerCase()] || [];
  const recommendedProducts = categoryProducts.slice(0, 4);
  const under50Products = categoryProducts.filter((p) => p.price < 50);

  const sortedProducts = [...categoryProducts].sort((a, b) => {
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <div className="category-container">
      {/* Hero Banner */}
      <div className="category-hero">
        <h1 className="category-title">{category}</h1>
        <p className="category-subtitle">
          Discover the best in {category.toLowerCase()}
        </p>
      </div>

      {/* Main Products */}
      <section className="products-section">
        <div className="products-header">
          <h2>All {category} Products</h2>
          <div className="sort-filter">
            <label htmlFor="sort">Sort by:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="default">Featured</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="no-products">
            <p>No products found in this category.</p>
            <Link to="/" className="back-to-home">
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {sortedProducts.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id}>
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recommended Products */}
      <section className="recommended-section">
        <h2>Recommended {category} Products</h2>
        <div className="product-grid">
          {recommendedProducts.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id}>
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      </section>

      {/* Products Under $50 */}
      <section className="budget-section">
        <h2>{category} Under $50</h2>
        {under50Products.length === 0 ? (
          <p>No products under $50 in this category.</p>
        ) : (
          <div className="budget-products">
            {category.toLowerCase() === "electronics" ? (
              under50Products.map((product) => (
                <DetailedProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="product-grid">
                {under50Products.map((product) => (
                  <Link to={`/product/${product.id}`} key={product.id}>
                    <ProductCard product={product} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Footer */}
      <div className="category-footer">
        <Link to="/" className="back-to-home">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Category;
