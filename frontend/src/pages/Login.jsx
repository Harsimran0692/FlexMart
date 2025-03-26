import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/Login.css";
import { useDispatch } from "react-redux";
import { setLoginUser } from "../feature/cart/loginUserSlice";
import { setCart } from "../feature/cart/cartSlice"; // Import setCart

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchCart = async (token) => {
    try {
      const response = await axios.get("http://localhost:5001/api/cart/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cartData = response.data.cart || response.data; // Adjust based on API response
      dispatch(setCart(cartData));
      localStorage.setItem("cart", JSON.stringify(cartData)); // Cache cart
      return cartData;
    } catch (error) {
      console.error("Error fetching cart:", error);
      const emptyCart = { items: [], totalItems: 0 };
      dispatch(setCart(emptyCart));
      localStorage.setItem("cart", JSON.stringify(emptyCart));
      return emptyCart;
    }
  };

  const LoginUser = async () => {
    try {
      setLoader(true);
      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        {
          email,
          password,
        }
      );
      setLoader(false);
      console.log("response.data: ", response.data);

      if (response.data.token) {
        const token = response.data.token;
        setSuccess(true);
        localStorage.setItem("token", token);

        // Set username in Redux and localStorage
        const firstName = response.data?.name?.split(" ")[0] || "User";
        dispatch(setLoginUser(firstName));
        localStorage.setItem("userName", firstName);

        // Fetch and set cart in Redux and localStorage
        await fetchCart(token);

        setTimeout(() => navigate("/"), 3000);
      } else {
        setError("Login failed");
      }
    } catch (error) {
      setLoader(false);
      setError(error.response?.data?.msg || "Login failed");
      console.error("Login error:", error.response?.data || error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoader(true);
    LoginUser();
  };

  // Auto-dismiss error and success after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className={`login-container ${loader ? "loading" : ""}`}>
      <div className="login-box">
        <h2 className="login-title">Sign In to FlexMart</h2>
        {success && (
          <div className="success-popup">Login successful! Redirecting...</div>
        )}
        {error && <div className="error-popup">{error}</div>}
        {loader && (
          <div className="loader">
            <span>Loading...</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="login-btn" disabled={loader}>
            {loader ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <p className="signup-prompt">
          New to FlexMart?{" "}
          <Link to="/signup" className="signup-link">
            Create an account
          </Link>
        </p>
        <Link to="/forgot-password" className="forgot-password">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}

export default Login;
