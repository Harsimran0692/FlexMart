import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../style/CategoryBar.css";

function CategoryBar() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://flexmart-backend.onrender.com/api";
  const limit = 100; // High limit to fetch all categories in one go (adjust as needed)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${API_URL}/categories?limit=${limit}&skip=0`
        );
        const { categories: newCategories, total } = response.data;

        // Filter out duplicates by _id
        const uniqueCategories = newCategories.filter(
          (cat, index, self) =>
            index === self.findIndex((c) => c._id === cat._id)
        );

        setCategories(uniqueCategories);
        if (uniqueCategories.length < total) {
          console.warn(
            `Fetched ${uniqueCategories.length} categories, but total is ${total}. Consider increasing limit.`
          );
        }
      } catch (error) {
        console.error(
          "Error fetching categories:",
          error.response?.data || error.message || error
        );
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [API_URL]);

  if (error) {
    return <nav className="category-bar error">{error}</nav>;
  }

  return (
    <nav className="category-bar">
      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <p className="loader-text">Loading Categories...</p>
        </div>
      ) : (
        categories.map((category) => (
          <Link
            key={category._id}
            to={`/categories/${category.name.split(" ").join("")}/${
              category._id
            }`}
            className="category-item"
          >
            {category.name}
          </Link>
        ))
      )}
    </nav>
  );
}

export default CategoryBar;
