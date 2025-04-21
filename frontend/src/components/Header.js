import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { setLoginUser } from "../feature/cart/loginUserSlice";
import { setCart } from "../feature/cart/cartSlice";
import axios from "axios";
import "../style/Header.css";

// Custom hook for debouncing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

function Header() {
  const [userToken, setUserToken] = useState(localStorage.getItem("token"));
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1); // Track the focused item
  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get cart and logged-in user from Redux store
  const cart = useSelector((state) => state.cart.cart);
  const cartCount = cart.totalItems || 0;
  const loggedInUser = useSelector((state) => state.loginUser.value);

  // Debounce search input
  const debouncedSearchValue = useDebounce(searchValue, 300);

  // Fetch username if token exists and Redux state is default
  const fetchUserName = async (token) => {
    try {
      const response = await fetch(
        "https://flexmart-backend.onrender.com/api/auth/user",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
      const response = await fetch(
        "https://flexmart-backend.onrender.com/api/cart/items",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }
      const data = await response.json();
      const updatedCart = data.cart || data;
      dispatch(setCart(updatedCart));
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error fetching cart:", error);
      dispatch(setCart({ items: [], totalItems: 0 }));
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

        if (loggedInUser === "Hello, SignIn") {
          const cachedName = localStorage.getItem("userName");
          if (cachedName) {
            dispatch(setLoginUser(cachedName));
          } else {
            await fetchUserName(userToken);
          }
        }

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

  // Search products with debounced value
  useEffect(() => {
    const searchItem = async () => {
      if (!debouncedSearchValue.trim()) {
        setSearchResults([]);
        setIsDropdownOpen(false);
        setFocusedIndex(-1); // Reset focused index when no results
        return;
      }

      try {
        const response = await axios.get(
          "https://flexmart-backend.onrender.com/api/products/"
        );
        const products = response.data;
        // console.log("Fetched products:", products); // Debug log
        const filtered = products.filter((product) =>
          product?.name
            ?.toLowerCase()
            .includes(debouncedSearchValue.toLowerCase())
        );
        setSearchResults(filtered);
        setIsDropdownOpen(true);
        setFocusedIndex(-1); // Reset focused index when new results load
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to search products");
        setSearchResults([]);
        setIsDropdownOpen(false);
        setFocusedIndex(-1);
      }
    };

    searchItem();
  }, [debouncedSearchValue]);

  // Handle clicks outside search to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clear error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {};

  const handleProductSelect = (product) => {
    if (!product._id) {
      console.error("Product ID is missing:", product);
      return;
    }
    setSearchValue(product.name);
    setIsDropdownOpen(false);
    setFocusedIndex(-1);
    navigate(`/product/${product._id}`);
  };

  const handleKeyDown = (e) => {
    if (!isDropdownOpen || searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault(); // Prevent cursor movement in input
      setFocusedIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev > 0 ? prev - 1 : searchResults.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < searchResults.length) {
        handleProductSelect(searchResults[focusedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
      setFocusedIndex(-1);
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <a href="/">FlexMart</a>
      </div>
      <div className="search-bar" ref={searchRef}>
        <input
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          placeholder="Search FlexMart..."
          onFocus={() => searchResults.length > 0 && setIsDropdownOpen(true)}
        />
        <button className="search-btn" onClick={handleSearch}>
          🔍
        </button>
        {isDropdownOpen && searchResults.length > 0 && (
          <ul className="search-dropdown">
            {searchResults.map((product, index) => (
              <li
                key={product._id ? `${product._id}-${index}` : `index-${index}`}
                onClick={() => handleProductSelect(product)}
                className={`search-item ${
                  focusedIndex === index ? "search-item-focused" : ""
                }`}
              >
                <span className="search-icon">🔍</span>
                {product.name}
              </li>
            ))}
          </ul>
        )}
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
