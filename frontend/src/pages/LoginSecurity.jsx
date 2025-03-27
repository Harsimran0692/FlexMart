import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/Profile.css";

function LoginSecurity() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [formData, setFormData] = useState({ password: "", newPassword: "" });
  const [editPassword, setEditPassword] = useState(false); // Toggle password edit form
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Clear error/success messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoader(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(
          "http://localhost:5001/api/user",
          config
        );
        setUserData({
          name: response.data.name || "Harsimran Singh", // Fallback data
          email: response.data.email || "harsimran0692@gmail.com",
          mobile: response.data.mobile || "+16472044156",
        });
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch user data");
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/signin");
        }
      } finally {
        setLoader(false);
      }
    };
    fetchUserData();
  }, [navigate]);

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
      setEditPassword(false); // Close the form after successful update
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

  // Placeholder for Edit functionality for Name, Email, and Mobile
  const handleEdit = (field) => {
    alert(`Edit ${field} functionality to be implemented`);
    // You can add logic to open a modal or form to edit the field
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
          {/* Name Section */}
          <div className="info-group">
            <div className="info-label">
              <label>Name</label>
              <p>{userData.name || "Not available"}</p>
            </div>
            <button className="edit-btn" onClick={() => handleEdit("Name")}>
              Edit
            </button>
          </div>

          {/* Email Section */}
          <div className="info-group">
            <div className="info-label">
              <label>Email</label>
              <p>{userData.email || "Not available"}</p>
            </div>
            <button className="edit-btn" onClick={() => handleEdit("Email")}>
              Edit
            </button>
          </div>

          {/* Primary Mobile Number Section */}
          <div className="info-group">
            <div className="info-label">
              <label>Primary mobile number</label>
              <p>{userData.mobile || "Not available"}</p>
              <span className="info-text">
                Quickly sign in, easily recover passwords and receive security
                notifications with this mobile number.
              </span>
            </div>
            <button
              className="edit-btn"
              onClick={() => handleEdit("Mobile Number")}
            >
              Edit
            </button>
          </div>

          {/* Password Section */}
          <div className="info-group">
            <div className="info-label">
              <label>Password</label>
              {editPassword ? (
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
                  <div className="form-actions">
                    <button type="submit" className="action-btn">
                      Save
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => {
                        setEditPassword(false);
                        setFormData({ password: "", newPassword: "" });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <p>********</p>
              )}
            </div>
            {!editPassword && (
              <button
                className="edit-btn"
                onClick={() => setEditPassword(true)}
              >
                Edit
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default LoginSecurity;
