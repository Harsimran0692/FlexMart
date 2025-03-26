import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/Profile.css";

function LoginSecurity() {
  const [formData, setFormData] = useState({ password: "", newPassword: "" });
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(
        "http://localhost:5001/api/user/password",
        formData,
        config
      );
      setSuccess("Password changed successfully");
      setFormData({ password: "", newPassword: "" });
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to change password");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/signin");
      }
    } finally {
      setLoader(false);
    }
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
          <h1>Login & Security</h1>
        </header>
        <section className="login-security-section">
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="action-btn">
              Change Password
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default LoginSecurity;
