import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset requested for:", { email });
    // Add your password reset logic here (e.g., API call to send reset link)
    setSubmitted(true); // Show success message after submission
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2 className="forgot-password-title">Reset Your Password</h2>
        {submitted ? (
          <div className="success-message">
            <p>
              If an account exists for {email}, a password reset link has been
              sent to your email. Please check your inbox (and spam/junk
              folder).
            </p>
            <Link to="/signin" className="back-to-login">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <p className="instructions">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
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
              <button type="submit" className="reset-btn">
                Send Reset Link
              </button>
            </form>
            <Link to="/signin" className="back-to-login">
              Back to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
