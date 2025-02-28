import React from "react";
import "../style/Header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <a href="/">FlexMart</a>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search FlexMart..." />
        <button className="search-btn">🔍</button>
      </div>
      <div className="user-actions">
        <a href="/signin">
          <span className="account">👤 Sign in</span>
        </a>
        <div className="logo-mobile">
          <a href="/">FlexMart</a>
        </div>
        <span className="cart-summary" id="total-products">
          <a href="/cart">🛒 Cart: 0</a>
        </span>
      </div>
    </header>
  );
}

export default Header;
