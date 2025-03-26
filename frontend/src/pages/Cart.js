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
        />
      </div>
      <div className="cart-item-content">
        <img
          src={
            item.product.image ||
            "https://via.placeholder.com/150x150?text=Product"
          }
          alt={item.name}
          className="cart-item-image"
        />
        <div className="cart-item-details">
          <h4>{item.name}</h4>
          <p className="deal-info">Big Spring Deal</p>
          <p className="price-info">
            <span className="discount">-21%</span>{" "}
            <span className="price">${item.price.toFixed(2)}</span>
          </p>
          <p className="list-price">
            List Price: ${(item.price / 0.79).toFixed(2)}
          </p>
          {/* <p className="delivery-info">
            <span className="prime">✓prime</span> Same-Day
          </p> */}
          <p className="delivery-time">FREE delivery Today 5 p.m. - 10 p.m.</p>
          {/* <p className="stock-status">
            {item.availability === "In Stock" ? (
              <span className="in-stock">In Stock</span>
            ) : (
              <span className="out-of-stock">
                Only {item.product.stock} left in stock (more on the way)
              </span>
            )}
          </p> */}
          <p className="shipping-info">
            Ships from and sold by <span className="seller">flexmart.ca</span>
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
            <button
              onClick={() => onRemove(item._id)}
              className="delete-btn"
              aria-label="Delete item"
            >
              Delete
            </button>
            <button className="save-for-later-btn" aria-label="Save for later">
              Save for later
            </button>
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
        <h2 className="cart-title">Cart</h2>
        {/* <button className="buy-again-tab">Buy Again</button> */}
      </div>
      {loading ? (
        <div className="loader">
          <div className="spinner"></div>
          Loading cart...
        </div>
      ) : error ? (
        <div className="error-popup">
          <FaExclamationCircle className="icon error-icon" /> {error}
        </div>
      ) : cartItems.length === 0 ? (
        <div className="empty-cart">
          <FaBoxOpen className="empty-cart-icon" />
          <p>Your cart is empty.</p>
          <Link to="/" className="continue-shopping">
            Start Shopping Now <FaArrowRight className="icon" />
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-summary">
            <h3>
              Subtotal:{" "}
              <span className="subtotal-amount">${subtotal.toFixed(2)}</span>
            </h3>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to checkout ({selectedCount} item
              {selectedCount !== 1 ? "s" : ""})
            </button>
          </div>
          <div className="select-all">
            <input
              type="checkbox"
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
            />
            <span>Select all items</span>
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
        </>
      )}
    </div>
  );
}

export default Cart;
