import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/Profile.css";
import { useDispatch } from "react-redux"; // Import useDispatch
import { setLoginUser } from "../feature/cart/loginUserSlice"; // Import the action
import { clearCart } from "../feature/cart/cartSlice";

function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoader(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }
        // const userResponse = await axios.get(
        //   "http://localhost:5001/api/user/profile",
        //   config
        // );
        // setUser(userResponse.data);

        // const ordersResponse = await axios.get(
        //   "http://localhost:5001/api/orders",
        //   config
        // );
        // setOrders(ordersResponse.data);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to load profile data");
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/signin");
        }
      } finally {
        setLoader(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("cart");
    dispatch(setLoginUser("Hello, SignIn")); // Reset Redux state to default
    dispatch(clearCart());
    navigate("/");
  };

  return (
    <div className={`profile-page ${loader ? "loading" : ""}`}>
      {loader && (
        <div className="loader">
          <span>Loading...</span>
        </div>
      )}
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}
      <div className="profile-content">
        <header className="profile-header">
          <h1>Your Account</h1>
          {user && (
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
            </div>
          )}
        </header>
        <section className="account-sections">
          <div className="section-group">
            <h2>Orders</h2>
            <div
              className="section-card"
              onClick={() => navigate("/profile/orders")}
            >
              <span>Your Orders</span>
              <span className="chevron">▶</span>
            </div>
          </div>
          <div className="section-group">
            <h2>Account Settings</h2>
            <div
              className="section-card"
              onClick={() => navigate("/profile/login-security")}
            >
              <span>Login & Security</span>
              <span className="chevron">▶</span>
            </div>
            <div
              className="section-card"
              onClick={() => navigate("/profile/addresses")}
            >
              <span>Your Addresses</span>
              <span className="chevron">▶</span>
            </div>
          </div>
          <div className="section-group">
            <h2>Customer Service</h2>
            <div
              className="section-card"
              onClick={() => navigate("/profile/contact-us")}
            >
              <span>Contact Us</span>
              <span className="chevron">▶</span>
            </div>
          </div>
          <div className="section-group">
            <h2>Actions</h2>
            <div className="section-card logout" onClick={handleLogout}>
              <span>Sign Out</span>
              <span className="chevron">▶</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
