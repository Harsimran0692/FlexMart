import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
    // Add your authentication logic here
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Sign In to FlexMart</h2>
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
          <button type="submit" className="login-btn">
            Sign In
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
