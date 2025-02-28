import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Cart.css";

function CartItem({ item, onRemove, onQuantityChange }) {
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-image" />
      <div className="cart-item-details">
        <h4>{item.name}</h4>
        <p className="price">${item.price.toFixed(2)}</p>
        <div className="quantity-control">
          <label>Qty:</label>
          <select
            value={item.quantity}
            onChange={(e) =>
              onQuantityChange(item.id, parseInt(e.target.value))
            }
            className="quantity-select"
          >
            {[1, 2, 3, 4, 5].map((qty) => (
              <option key={qty} value={qty}>
                {qty}
              </option>
            ))}
          </select>
          <button onClick={() => onRemove(item.id)} className="remove-btn">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Laptop",
      price: 999.99,
      quantity: 1,
      image: "https://via.placeholder.com/150x150?text=Laptop",
    },
    {
      id: 2,
      name: "Headphones",
      price: 89.99,
      quantity: 2,
      image: "https://via.placeholder.com/150x150?text=Headphones",
    },
  ]);

  const navigate = useNavigate();

  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, quantity) => {
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Add items before checking out!");
      return;
    }
    navigate("/checkout", { state: { cartItems, subtotal } });
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <img
            src="https://via.placeholder.com/200x200?text=Empty+Cart"
            alt="Empty Cart"
            className="empty-cart-icon"
          />
          <p>Your cart is empty.</p>
          <Link to="/" className="continue-shopping">
            Start Shopping Now
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={handleRemove}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-details">
              <div className="summary-row">
                <span>Items ({cartItems.length}):</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span className="subtotal">${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <Link to="/" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
