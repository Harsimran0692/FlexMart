import React from "react";
import { Link } from "react-router-dom"; // Added for navigation
import "../style/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      {/* Back to Top Button */}
      <div className="back-to-top">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Back to Top
        </button>
      </div>

      {/* Main Footer Links */}
      <div className="footer-links">
        <div className="footer-column">
          <h4>Get to Know Us</h4>
          <Link to="/about">About FlexMart</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/press">Press Releases</Link>
        </div>
        <div className="footer-column">
          <h4>Shop With Us</h4>
          <Link to="/account">Your Account</Link>
          <Link to="/orders">Your Orders</Link>
          <Link to="/customer-service">Customer Service</Link>
        </div>
        <div className="footer-column">
          <h4>Categories</h4>
          <Link to="/categories/electronics">Electronics</Link>
          <Link to="/categories/clothing">Clothing</Link>
          <Link to="/categories/books">Books</Link>
          <Link to="/categories/toys">Toys</Link>
        </div>
        <div className="footer-column">
          <h4>Account & More</h4>
          <Link to="/signin">Sign In</Link>
          <Link to="/signup">Create an Account</Link>
          <Link to="/help">Help</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="country-selector">
          <p>Canada</p>
          <img
            src="https://flagcdn.com/24x18/ca.png"
            alt="Canada Flag"
            className="country-flag"
          />
        </div>
        <div className="footer-copy">
          <p>© 2025, FlexMart, Inc. or its affiliates</p>
          <div className="legal-links">
            <Link to="/#">Conditions of Use</Link>
            <Link to="/#">Privacy Notice</Link>
            <Link to="/#">Interest-Based Ads</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
