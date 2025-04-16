import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Cart.css";
import { useSelector, useDispatch } from "react-redux";
import { setCart } from "../feature/cart/cartSlice";
import axios from "axios";
import {
  FaTrash,
  FaExclamationCircle,
  FaArrowRight,
  FaBoxOpen,
  FaCheckCircle,
  FaShippingFast,
  FaStore,
  FaTag,
} from "react-icons/fa";

function CartItem({ item, onRemove, onQuantityChange, onSelectChange }) {
  const [isSelected, setIsSelected] = useState(true);

  const handleSelectChange = () => {
    setIsSelected(!isSelected);
    onSelectChange(item._id, !isSelected);
  };

  return (
    <div className="cart-item card">
      <div className="cart-item-selection">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelectChange}
          className="custom-checkbox"
        />
      </div>
      <div className="cart-item-content">
        <div className="cart-item-image-container">
          <img
            src={
              item.product.image ||
              "https://via.placeholder.com/150x150?text=Product" ||
              "/placeholder.svg"
            }
            alt={item.name}
            className="cart-item-image"
          />
        </div>
        <div className="cart-item-details">
          <h4 className="item-title">{item.name}</h4>
          <div className="item-badges">
            <span className="deal-info">
              <FaTag className="badge-icon" /> Big Spring Deal
            </span>
          </div>
          <div className="price-container">
            <span className="discount">-21%</span>
            <span className="price">${item.price.toFixed(2)}</span>
            <span className="list-price">
              List Price: ${(item.price / 0.79).toFixed(2)}
            </span>
          </div>
          <div className="delivery-container">
            <p className="delivery-time">
              <FaShippingFast className="delivery-icon" /> FREE delivery Today 5
              p.m. - 10 p.m.
            </p>
          </div>
          <p className="shipping-info">
            <FaStore className="store-icon" /> Ships from and sold by{" "}
            <span className="seller">flexmart.ca</span>
          </p>
          <div className="cart-item-actions">
            <div className="quantity-control">
              <FaTrash
                className="icon trash-icon"
                onClick={() => onRemove(item._id)}
              />
              <select
                value={item.quantity}
                onChange={(e) =>
                  onQuantityChange(item._id, parseInt(e.target.value))
                }
                className="quantity-select"
              >
                {[...Array(10).keys()].map((qty) => (
                  <option key={qty + 1} value={qty + 1}>
                    {qty + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className="action-buttons">
              <button
                onClick={() => onRemove(item._id)}
                className="delete-btn"
                aria-label="Delete item"
              >
                Delete
              </button>
              <button
                className="save-for-later-btn"
                aria-label="Save for later"
              >
                Save for later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cart() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItems, setSelectedItems] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const cartItems = cart.items || [];
  const API_URL = "http://localhost:5001/api";

  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please sign in to view your cart.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/cart/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cartData = response.data.cart || { items: [], totalItems: 0 };
      dispatch(setCart(cartData));
      localStorage.setItem("cart", JSON.stringify(cartData));
      const initialSelection = {};
      cartData.items.forEach((item) => {
        initialSelection[item._id] = true;
      });
      setSelectedItems(initialSelection);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load cart");
      dispatch(setCart({ items: [], totalItems: 0 }));
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, quantity) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please sign in to update your cart.");
        return;
      }

      const response = await axios.put(
        `${API_URL}/cart/items/${itemId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedCart = response.data;
      dispatch(setCart(updatedCart));
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update quantity");
    }
  };

  const handleRemove = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please sign in to remove items.");
        return;
      }

      const response = await axios.delete(`${API_URL}/cart/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedCart = response.data.cart;
      dispatch(setCart(updatedCart));
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setSelectedItems((prev) => {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      });
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to remove item");
    }
  };

  const handleSelectChange = (itemId, isSelected) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: isSelected,
    }));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const selectedCartItems = cartItems.filter((item) => selectedItems[item._id]);
  const subtotal = selectedCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const selectedCount = selectedCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleCheckout = () => {
    if (selectedCartItems.length === 0) {
      alert("Please select items to checkout!");
      return;
    }
    navigate("/checkout", {
      state: { cartItems: selectedCartItems, subtotal },
    });
  };

  return (
    <div className={`cart-container ${loading ? "loading" : ""}`}>
      <div className="cart-header">
        <h2 className="cart-title">Shopping Cart</h2>
        {/* <button className="buy-again-tab">Buy Again</button> */}
      </div>
      {loading ? (
        <div className="loader">
          <div className="spinner"></div>
          <p className="loading-text">Loading your cart...</p>
        </div>
      ) : error ? (
        <div className="error-popup">
          <FaExclamationCircle className="icon error-icon" /> {error}
        </div>
      ) : cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon-container">
            <FaBoxOpen className="empty-cart-icon" />
          </div>
          <h3 className="empty-cart-title">Your cart is empty</h3>
          <p className="empty-cart-message">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link to="/" className="continue-shopping">
            Start Shopping Now <FaArrowRight className="icon" />
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-content">
            <div className="cart-items-container">
              <div className="select-all">
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  checked={
                    cartItems.length > 0 &&
                    Object.values(selectedItems).every(Boolean)
                  }
                  onChange={(e) => {
                    const newSelection = {};
                    cartItems.forEach((item) => {
                      newSelection[item._id] = e.target.checked;
                    });
                    setSelectedItems(newSelection);
                  }}
                  id="select-all-checkbox"
                />
                <label htmlFor="select-all-checkbox">Select all items</label>
              </div>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <CartItem
                    key={item._id}
                    item={item}
                    onRemove={handleRemove}
                    onQuantityChange={handleQuantityChange}
                    onSelectChange={handleSelectChange}
                  />
                ))}
              </div>
            </div>
            <div className="cart-summary">
              <div className="summary-header">
                <h3>Order Summary</h3>
              </div>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Items ({selectedCount}):</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span className="free-shipping">FREE</span>
                </div>
                <div className="summary-row total">
                  <span>Order total:</span>
                  <span className="subtotal-amount">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="checkout-container">
                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceed to checkout ({selectedCount} item
                  {selectedCount !== 1 ? "s" : ""})
                </button>
                <div className="secure-checkout">
                  <FaCheckCircle className="secure-icon" /> Secure transaction
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
