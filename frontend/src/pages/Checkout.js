import React from "react";
import "../style/Checkout.css";
import { Link } from "react-router-dom";

function Checkout() {
  return (
    <section className="checkout-page">
      <h1>Checkout</h1>
      <form className="checkout-form">
        <h2>Shipping Information</h2>
        <input type="text" placeholder="Full Name" required />
        <input type="text" placeholder="Address" required />
        <input type="text" placeholder="City" required />
        <input type="text" placeholder="ZIP Code" required />

        <h2>Payment Information</h2>
        <input type="text" placeholder="Card Number" required />
        <input type="text" placeholder="Expiry Date (MM/YY)" required />
        <input type="text" placeholder="CVV" required />

        <button type="submit" className="confirm-btn">
          Confirm Order
        </button>
      </form>
      <Link to="/cart" className="back-to-cart">
        Back to Cart
      </Link>
    </section>
  );
}

export default Checkout;
