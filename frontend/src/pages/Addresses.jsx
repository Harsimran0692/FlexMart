import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal"; // Ensure this is installed: npm install react-modal
import "../style/Profile.css";

Modal.setAppElement("#root"); // For accessibility

function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
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
          "http://localhost:5001/api/addresses",
          config
        );
        setAddresses(response.data.addresses || []);
      } catch (err) {
        // Do not set error here; just use the empty addresses array
        if (err.response && err.response.status === 404) {
          setAddresses([]);
        } else if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/signin");
        } else {
          setError(err.response?.data?.msg || "Failed to fetch addresses");
        }
      } finally {
        setLoader(false);
      }
    };
    fetchAddresses();
  }, [navigate]);

  // Add new address
  const handleAddAddress = async (newAddress) => {
    setLoader(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(
        "http://localhost:5001/api/addresses/addAddress",
        newAddress,
        config
      );
      console.log("Add Response:", response.data); // Debug log
      setAddresses(response.data.addresses || [...addresses, newAddress]);
      setSuccess("Address added successfully");
      setIsAddModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to add address");
    } finally {
      setLoader(false);
    }
  };

  // Edit existing address (by index) with error handling
  const handleEditAddress = (index) => {
    if (index < 0 || index >= addresses.length) {
      setError("Invalid address index");
      return;
    }
    const addr = addresses[index];
    if (!addr) {
      setError("Address data is incomplete");
      return;
    }
    setCurrentAddress({ ...addr, index });
    setIsEditModalOpen(true);
  };

  const handleUpdateAddress = async (updatedAddress) => {
    setLoader(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(
        `http://localhost:5001/api/addresses/updateAddress/${currentAddress.index}`,
        updatedAddress,
        config
      );
      const newAddresses = [...addresses];
      newAddresses[currentAddress.index] = updatedAddress;
      setAddresses(newAddresses);
      setSuccess("Address updated successfully");
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update address");
    } finally {
      setLoader(false);
    }
  };

  const handleRemoveAddress = async (index) => {
    if (window.confirm("Are you sure you want to remove this address?")) {
      setLoader(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(
          `http://localhost:5001/api/addresses/deleteAddress/${index}`,
          config
        );
        const newAddresses = addresses.filter((_, i) => i !== index);
        setAddresses(newAddresses);
        setSuccess("Address removed successfully");
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to remove address");
      } finally {
        setLoader(false);
      }
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentAddress) {
      handleUpdateAddress(formData);
    } else {
      handleAddAddress(formData);
    }
    setFormData({ name: "", address: "", phone: "", email: "" });
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentAddress(null);
    setFormData({ name: "", address: "", phone: "", email: "" });
  };

  useEffect(() => {
    if (currentAddress) {
      setFormData({
        name: currentAddress.name || "",
        address: currentAddress.address || "",
        phone: currentAddress.phone || "",
        email: currentAddress.email || "",
      });
    }
  }, [currentAddress]);

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
          <div className="addresses-grid">
            {addresses.length === 0 ? (
              <div className="address-card add-address" onClick={openAddModal}>
                <div className="add-icon">+</div>
                <span>Add Address</span>
              </div>
            ) : (
              <>
                <div
                  className="address-card add-address"
                  onClick={openAddModal}
                >
                  <div className="add-icon">+</div>
                  <span>Add Address</span>
                </div>
                {addresses.map((address, index) => (
                  <div key={index} className="address-card">
                    {address.isDefault && (
                      <span className="default-label">Default</span>
                    )}
                    <div className="address-info">
                      <h3>{address.name}</h3>
                      <p>{address.address}</p>
                      <p>Phone: {address.phone}</p>
                      <p>Email: {address.email}</p>
                    </div>
                    <div className="address-actions">
                      <button
                        className="action-link"
                        onClick={() => handleEditAddress(index)}
                      >
                        Edit
                      </button>
                      <span className="separator">|</span>
                      <button
                        className="action-link"
                        onClick={() => handleRemoveAddress(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </section>
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={closeAddModal}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "350px",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            border: "none",
            background: "linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)",
            animation: "fadeIn 0.3s ease-out",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 1000,
          },
        }}
        contentLabel="Add Address Modal"
      >
        <div className="modal-header">
          <h2 className="modal-title">Add an Address</h2>
          <button onClick={closeAddModal} className="modal-close">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your address"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter phone number"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email (Optional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter email (optional)"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button">
              Add Address
            </button>
            <button
              type="button"
              onClick={closeAddModal}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Address Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "350px",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            border: "none",
            background: "linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)",
            animation: "fadeIn 0.3s ease-out",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 1000,
          },
        }}
        contentLabel="Edit Address Modal"
      >
        <div className="modal-header">
          <h2 className="modal-title">Edit Your Address</h2>
          <button onClick={closeEditModal} className="modal-close">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your address"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter phone number"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email (Optional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter email (optional)"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button">
              Update Address
            </button>
            <button
              type="button"
              onClick={closeEditModal}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Addresses;
