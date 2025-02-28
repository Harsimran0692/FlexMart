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
  console.log(category);

  const [products] = useState({
    electronics: [
      {
        id: 1,
        name: "Laptop",
        image: "https://via.placeholder.com/300x300?text=Laptop",
        price: 999.99,
      },
      {
        id: 2,
        name: "Headphones",
        image: "https://via.placeholder.com/300x300?text=Headphones",
        price: 89.99,
      },
      {
        id: 3,
        name: "Mouse",
        image: "https://via.placeholder.com/300x300?text=Mouse",
        price: 29.99,
      },
      {
        id: 4,
        name: "Keyboard",
        image: "https://via.placeholder.com/300x300?text=Keyboard",
        price: 59.99,
      },
      {
        id: 5,
        name: "Monitor",
        image: "https://via.placeholder.com/300x300?text=Monitor",
        price: 199.99,
      },
      {
        id: 6,
        name: "Webcam",
        image: "https://via.placeholder.com/300x300?text=Webcam",
        price: 49.99,
      },
    ],
    toys: [
      {
        id: 7,
        name: "Action Figure",
        image: "https://via.placeholder.com/300x300?text=Action+Figure",
        price: 19.99,
      },
      {
        id: 8,
        name: "Puzzle",
        image: "https://via.placeholder.com/300x300?text=Puzzle",
        price: 14.99,
      },
      {
        id: 9,
        name: "Lego Set",
        image: "https://via.placeholder.com/300x300?text=Lego",
        price: 49.99,
      },
      {
        id: 10,
        name: "Doll",
        image: "https://via.placeholder.com/300x300?text=Doll",
        price: 24.99,
      },
    ],
    books: [
      {
        id: 11,
        name: "Novel",
        image: "https://via.placeholder.com/300x300?text=Novel",
        price: 15.99,
      },
      {
        id: 12,
        name: "Textbook",
        image: "https://via.placeholder.com/300x300?text=Textbook",
        price: 79.99,
      },
      {
        id: 13,
        name: "Comic",
        image: "https://via.placeholder.com/300x300?text=Comic",
        price: 9.99,
      },
      {
        id: 14,
        name: "Cookbook",
        image: "https://via.placeholder.com/300x300?text=Cookbook",
        price: 29.99,
      },
    ],
    clothing: [
      {
        id: 15,
        name: "T-Shirt",
        image: "https://via.placeholder.com/300x300?text=T-Shirt",
        price: 19.99,
      },
      {
        id: 16,
        name: "Jacket",
        image: "https://via.placeholder.com/300x300?text=Jacket",
        price: 89.99,
      },
      {
        id: 17,
        name: "Jeans",
        image: "https://via.placeholder.com/300x300?text=Jeans",
        price: 49.99,
      },
      {
        id: 18,
        name: "Hat",
        image: "https://via.placeholder.com/300x300?text=Hat",
        price: 24.99,
      },
    ],
  });

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
