import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../style/Header.css";
import { useSelector, useDispatch } from "react-redux";
import { setLoginUser } from "../feature/cart/loginUserSlice";
import { setCart } from "../feature/cart/cartSlice";

function Header() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userToken, setUserToken] = useState(localStorage.getItem("token"));
  const [error, setError] = useState("");
  const selectRef = React.useRef(null);
  const dispatch = useDispatch();

  // Get cart and logged-in user from Redux store
  const cart = useSelector((state) => state.cart.cart);
  const cartCount = cart.totalItems || 0;
  const loggedInUser = useSelector((state) => state.loginUser.value);

  // Fetch username if token exists and Redux state is default
  const fetchUserName = async (token) => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Invalid Token");
      }
      const data = await response.json();
      const name = data.name?.split(" ")[0] || "User";
      dispatch(setLoginUser(name));
      localStorage.setItem("userName", name);
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      setUserToken(null);
      dispatch(setLoginUser("Hello, SignIn"));
    }
  };

  // Fetch cart from server
  const fetchCart = async (token) => {
    try {
      const response = await fetch("http://localhost:5001/api/cart/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }
      const data = await response.json();
      const updatedCart = data.cart || data; // Adjust based on API response
      dispatch(setCart(updatedCart));
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Cache in localStorage
    } catch (error) {
      console.error("Error fetching cart:", error);
      dispatch(setCart({ items: [], totalItems: 0 })); // Reset on error
      localStorage.setItem(
        "cart",
        JSON.stringify({ items: [], totalItems: 0 })
      );
    }
  };

  // Restore state on mount or token change
  useEffect(() => {
    const restoreState = async () => {
      if (!userToken) {
        if (loggedInUser !== "Hello, SignIn") {
          dispatch(setLoginUser("Hello, SignIn"));
        }
        dispatch(setCart({ items: [], totalItems: 0 }));
        localStorage.setItem(
          "cart",
          JSON.stringify({ items: [], totalItems: 0 })
        );
        return;
      }

      try {
        const decoded = jwtDecode(userToken);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
          localStorage.removeItem("token");
          localStorage.removeItem("userName");
          setUserToken(null);
          dispatch(setLoginUser("Hello, SignIn"));
          dispatch(setCart({ items: [], totalItems: 0 }));
          localStorage.setItem(
            "cart",
            JSON.stringify({ items: [], totalItems: 0 })
          );
          return;
        }

        // Restore username
        if (loggedInUser === "Hello, SignIn") {
          const cachedName = localStorage.getItem("userName");
          if (cachedName) {
            dispatch(setLoginUser(cachedName));
          } else {
            await fetchUserName(userToken);
          }
        }

        // Restore cart
        const cachedCart = localStorage.getItem("cart");
        if (cachedCart) {
          dispatch(setCart(JSON.parse(cachedCart)));
        }
        await fetchCart(userToken);
      } catch (error) {
        console.error("Invalid token or fetch error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        setUserToken(null);
        dispatch(setLoginUser("Hello, SignIn"));
        dispatch(setCart({ items: [], totalItems: 0 }));
        localStorage.setItem(
          "cart",
          JSON.stringify({ items: [], totalItems: 0 })
        );
      }
    };

    restoreState();
  }, [userToken, dispatch]);

  // Sync userToken with localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      setUserToken(newToken);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Fetch categories
  useEffect(() => {
    fetch("http://localhost:5001/api/categories/all")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories");
      });
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">FlexMart</Link>
      </div>
      <div className="search-bar">
        <div
          className={`category-dropdown ${
            selectedCategory !== "All" ? "expanded" : ""
          }`}
        >
          <select
            ref={selectRef}
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="All">All</option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <span className="dropdown-arrow">▼</span>
        </div>
        <input type="text" placeholder="Search FlexMart..." />
        <button className="search-btn">🔍</button>
      </div>
      <div className="user-actions">
        {loggedInUser === "Hello, SignIn" ? (
          <Link to="/signin">
            <span className="account">👤 {loggedInUser}</span>
          </Link>
        ) : (
          <Link to="/profile">
            <span className="account">👤 {loggedInUser}</span>
          </Link>
        )}
        <div className="logo-mobile">
          <Link to="/">FlexMart</Link>
        </div>
        <span className="cart-summary-header">
          <Link to="/cart">🛒 Cart: {cartCount}</Link>
        </span>
      </div>
      {error && <div className="error-popup">{error}</div>}
    </header>
  );
}

export default Header;
