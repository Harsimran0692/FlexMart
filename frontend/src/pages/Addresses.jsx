import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/Profile.css";

function Addresses() {
  const [addresses, setAddresses] = useState([]);
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

  // Fetch addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      setLoader(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(
          "http://localhost:5001/api/user/addresses",
          config
        );
        setAddresses(response.data || []);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch addresses");
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/signin");
        }
      } finally {
        setLoader(false);
      }
    };
    fetchAddresses();
  }, [navigate]);

  // Placeholder data (remove this if using real API data)
  const mockAddresses = [
    {
      id: 1,
      name: "Harsimran Singh",
      address:
        "UC-23, 2ndF Usha Park, Petrol Pump Behind Om sweets, New Delhi, DELHI 110064, India",
      phone: "9811373822",
      isDefault: true,
    },
    {
      id: 2,
      name: "Divya Yadav",
      address: "46 Turner Drive, Sarnia, Ontario N7S 4L2, Canada",
      phone: "4377996872",
      isDefault: false,
    },
    {
      id: 3,
      name: "Harsimran Singh",
      address: "3 acre height cresent, Scarborough, Ontario M1H 2N8, Canada",
      phone: "16472044156",
      isDefault: false,
    },
    {
      id: 4,
      name: "Harsimran Singh",
      address: "43 Iceland Poppy Trail, Brampton, Ontario L7A 0N1, Canada",
      phone: "6472044156",
      isDefault: false,
    },
    {
      id: 5,
      name: "Harsimran Singh",
      address: "Browley Drive 20, Brampton, Ontario L7A 3C9, Canada",
      phone: "6472044156",
      isDefault: false,
    },
  ];

  // Use mock data if API response is empty (for demo purposes)
  useEffect(() => {
    if (addresses.length === 0) {
      setAddresses(mockAddresses);
    }
  }, [addresses]);

  const handleAddAddress = () => {
    alert("Add Address functionality to be implemented");
    // Navigate to an add address form or open a modal
  };

  const handleEditAddress = (id) => {
    alert(`Edit Address ${id} functionality to be implemented`);
    // Navigate to an edit address form or open a modal with the address data
  };

  const handleRemoveAddress = async (id) => {
    if (window.confirm("Are you sure you want to remove this address?")) {
      setLoader(true);
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(
          `http://localhost:5001/api/user/addresses/${id}`,
          config
        );
        setAddresses(addresses.filter((address) => address.id !== id));
        setSuccess("Address removed successfully");
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to remove address");
      } finally {
        setLoader(false);
      }
    }
  };

  const handleSetDefault = async (id) => {
    setLoader(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(
        `http://localhost:5001/api/user/addresses/${id}/default`,
        {},
        config
      );
      setAddresses(
        addresses.map((address) =>
          address.id === id
            ? { ...address, isDefault: true }
            : { ...address, isDefault: false }
        )
      );
      setSuccess("Default address updated successfully");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to set default address");
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
          <h1>Your Addresses</h1>
        </header>
        <section className="addresses-section">
          {addresses.length === 0 ? (
            <p className="no-data">No addresses found.</p>
          ) : (
            <div className="addresses-grid">
              {/* Add Address Card */}
              <div
                className="address-card add-address"
                onClick={handleAddAddress}
              >
                <div className="add-icon">+</div>
                <span>Add Address</span>
              </div>
              {/* Address Cards */}
              {addresses.map((address) => (
                <div key={address.id} className="address-card">
                  {address.isDefault && (
                    <span className="default-label">Default: amazon</span>
                  )}
                  <div className="address-info">
                    <h3>{address.name}</h3>
                    <p>{address.address}</p>
                    <p>Phone number: {address.phone}</p>
                    <a href="#" className="delivery-instructions">
                      Add delivery instructions
                    </a>
                  </div>
                  <div className="address-actions">
                    <button
                      className="action-link"
                      onClick={() => handleEditAddress(address.id)}
                    >
                      Edit
                    </button>
                    <span className="separator">|</span>
                    <button
                      className="action-link"
                      onClick={() => handleRemoveAddress(address.id)}
                    >
                      Remove
                    </button>
                    {!address.isDefault && (
                      <>
                        <span className="separator">|</span>
                        <button
                          className="action-link"
                          onClick={() => handleSetDefault(address.id)}
                        >
                          Set as Default
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Addresses;
