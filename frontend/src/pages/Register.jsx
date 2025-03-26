import React, { useState } from "react";
import { Link } from "react-router-dom"; // Fixed import
import axios from "axios";
import "../style/Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);
  const [success, setSuccess] = useState(false);

  const RegisterUser = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/register",
        { name, email, password }
      );
      setLoader(false);
      setSuccess(true);
      console.log("Registration successful:", response.data);
      window.location.href = "/signin";
    } catch (err) {
      setLoader(false);
      setError(err.response?.data?.msg || "Registration failed");
      console.error("Error:", err.response?.data || err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError(""); // Clear previous errors
    setLoader(true);
    RegisterUser();
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Create Your FlexMart Account</h2>
        {success && (
          <p className="success-msg">
            Registration successful! Please sign in.
          </p>
        )}
        {error && <div className="error-popup">{error}</div>}
        {loader && <div className="loader">Loading...</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>
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
              placeholder="Create a password"
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
            />
          </div>
          <button type="submit" className="register-btn" disabled={loader}>
            {loader ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="login-prompt">
          Already have an account?{" "}
          <Link to="/signin" className="login-link">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
