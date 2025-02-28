import React from "react";
import "../style/CategoryBar.css";

function CategoryBar() {
  const categories = ["Electronics", "Clothing", "Home", "Books", "Toys"];
  return (
    <nav className="category-bar">
      {categories.map((category, index) => (
        <span key={index} className="category-item">
          {category}
        </span>
      ))}
    </nav>
  );
}

export default CategoryBar;
