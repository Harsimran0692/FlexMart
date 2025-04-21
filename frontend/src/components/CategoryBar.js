import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../style/CategoryBar.css";

function CategoryBar() {
  const [categories, setCategories] = useState([]);
  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://flexmart-backend.onrender.com/api";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [API_URL]);

  return (
    <nav className="category-bar">
      {categories.map((category) => (
        <Link
          key={category._id}
          to={`/categories/${category.name.toLowerCase()}`}
          className="category-item"
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}

export default CategoryBar;
