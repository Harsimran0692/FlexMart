import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/Orders.css";
import {
  FaShoppingBag,
  FaBox,
  FaCalendarAlt,
  FaDollarSign,
  FaBoxOpen,
  FaSpinner,
  FaExclamationTriangle,
  FaSearch,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClipboardList,
  FaFilter,
  FaSortAmountDown,
  FaAngleRight,
  FaMapMarkerAlt,
  FaCreditCard,
} from "react-icons/fa";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoader(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(
          "http://localhost:5001/api/orders",
          config
        );
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to load orders");
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/signin");
        }
      } finally {
        setLoader(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "completed";
      case "pending":
        return "pending";
      case "cancelled":
        return "cancelled";
      case "shipped":
        return "shipped";
      case "placed":
        return "placed";
      default:
        return "";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <FaCheckCircle className="status-icon" />;
      case "pending":
        return <FaClipboardList className="status-icon" />;
      case "cancelled":
        return <FaTimesCircle className="status-icon" />;
      case "shipped":
        return <FaTruck className="status-icon" />;
      case "placed":
        return <FaBox className="status-icon" />;
      default:
        return <FaClipboardList className="status-icon" />;
    }
  };

  const getDisplayStatus = (order) => {
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    const hoursSinceOrder = (now - orderDate) / (1000 * 60 * 60);

    if (order.status.toLowerCase() === "pending" && hoursSinceOrder > 24) {
      return "placed";
    }
    return order.status.toLowerCase();
  };

  const canCancelOrder = (order) => {
    if (order.status.toLowerCase() !== "pending") return false;
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    const hoursSinceOrder = (now - orderDate) / (1000 * 60 * 60);
    return hoursSinceOrder <= 12;
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(
        `http://localhost:5001/api/orders/${orderId}`,
        { status: "cancelled" },
        config
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to cancel order");
      setLoader(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const filteredOrders = orders
    .filter((order) =>
      order.items.some((item) =>
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .filter((order) => {
      if (activeFilter === "all") return true;
      return getDisplayStatus(order) === activeFilter;
    });

  const getOrderStatusCount = (status) => {
    return orders.filter((order) => getDisplayStatus(order) === status).length;
  };

  return (
    <div className={`profile-page ${loader ? "loading" : ""}`}>
      {loader && (
        <div className="loader-container">
          <div className="loader">
            <div className="spinner-ring"></div>
            <span>Loading your orders...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert error">
          <FaExclamationTriangle className="alert-icon" />
          {error}
        </div>
      )}

      <div className="profile-content">
        <header className="profile-header">
          <div className="header-content">
            <div className="header-icon-container">
              <FaShoppingBag className="header-icon" />
            </div>
            <div className="header-text">
              <h1>Your Orders</h1>
              <p className="header-subtitle">
                Track, manage, and review your purchase history
              </p>
            </div>
          </div>
          <div className="search-container">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search orders by product name..."
                className="search-input"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
        </header>

        <section className="orders-section">
          <div className="orders-summary">
            <div
              className={`summary-card ${
                activeFilter === "all" ? "active" : ""
              }`}
              onClick={() => handleFilterChange("all")}
            >
              <div className="summary-icon">
                <FaBox />
              </div>
              <div className="summary-content">
                <span className="summary-value">{orders.length}</span>
                <span className="summary-label">All Orders</span>
              </div>
            </div>

            <div
              className={`summary-card ${
                activeFilter === "completed" ? "active" : ""
              }`}
              onClick={() => handleFilterChange("completed")}
            >
              <div className="summary-icon completed-icon">
                <FaCheckCircle />
              </div>
              <div className="summary-content">
                <span className="summary-value">
                  {getOrderStatusCount("completed")}
                </span>
                <span className="summary-label">Completed</span>
              </div>
            </div>

            <div
              className={`summary-card ${
                activeFilter === "pending" ? "active" : ""
              }`}
              onClick={() => handleFilterChange("pending")}
            >
              <div className="summary-icon pending-icon">
                <FaClipboardList />
              </div>
              <div className="summary-content">
                <span className="summary-value">
                  {getOrderStatusCount("pending")}
                </span>
                <span className="summary-label">Pending</span>
              </div>
            </div>

            <div
              className={`summary-card ${
                activeFilter === "shipped" ? "active" : ""
              }`}
              onClick={() => handleFilterChange("shipped")}
            >
              <div className="summary-icon shipped-icon">
                <FaTruck />
              </div>
              <div className="summary-content">
                <span className="summary-value">
                  {getOrderStatusCount("shipped")}
                </span>
                <span className="summary-label">Shipped</span>
              </div>
            </div>
          </div>

          {/* <div className="orders-filter-bar">
            <div className="filter-label">
              <FaFilter className="filter-icon" />
              <span>
                Showing:{" "}
                {activeFilter === "all"
                  ? "All Orders"
                  : `${
                      activeFilter.charAt(0).toUpperCase() +
                      activeFilter.slice(1)
                    } Orders`}
              </span>
            </div>
            <div className="sort-options">
              <FaSortAmountDown className="sort-icon" />
              <select className="sort-select">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
            </div>
          </div> */}

          {filteredOrders.length > 0 ? (
            <div className="orders-grid">
              {filteredOrders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-card-header">
                    <div className="order-id-container">
                      <span className="order-id-label">Order ID</span>
                      <span className="order-id">#{order._id.slice(-6)}</span>
                    </div>
                    <div className="order-status-container">
                      {getStatusIcon(getDisplayStatus(order))}
                      <span
                        className={`order-status ${getStatusClass(
                          getDisplayStatus(order)
                        )}`}
                      >
                        {getDisplayStatus(order)}
                      </span>
                    </div>
                  </div>

                  <div className="order-card-body">
                    <div className="order-info-row">
                      <div className="order-info-item">
                        <FaCalendarAlt className="info-icon" />
                        <div className="info-content">
                          <span className="info-label">Order Date</span>
                          <span className="info-value">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="order-info-item">
                        <FaDollarSign className="info-icon" />
                        <div className="info-content">
                          <span className="info-label">Total Amount</span>
                          <span className="info-value">
                            ${order.totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="order-info-item">
                        <FaBoxOpen className="info-icon" />
                        <div className="info-content">
                          <span className="info-label">Items</span>
                          <span className="info-value">
                            {order.items.length}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="order-products">
                      <h3 className="products-title">Ordered Products</h3>
                      <div className="products-list">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="product-item">
                            <div className="product-image-placeholder"></div>
                            <div className="product-details">
                              <span className="product-name">
                                {item.product.name}
                              </span>
                              <div className="product-meta">
                                <span className="product-quantity">
                                  Qty: {item.quantity}
                                </span>
                                <span className="product-price">
                                  ${item.price.toFixed(2)} each
                                </span>
                              </div>
                            </div>
                            <div className="product-total">
                              ${(item.quantity * item.price).toFixed(2)}
                            </div>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="more-products">
                            +{order.items.length - 2} more items
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="order-footer">
                      {canCancelOrder(order) && (
                        <button
                          className="cancel-order-btn"
                          onClick={() => handleCancelOrder(order._id)}
                        >
                          <FaTimesCircle className="cancel-icon" />
                          Cancel Order
                        </button>
                      )}
                      {/* <Link
                        to={`/profile/orders/${order._id}`}
                        className="view-details-btn"
                      >
                        View Details
                        <FaAngleRight className="details-icon" />
                      </Link> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-orders">
              <div className="empty-icon-container">
                <FaShoppingBag className="empty-icon" />
              </div>
              <h3>No Orders Found</h3>
              <p>
                {searchQuery
                  ? "No orders match your search."
                  : "You haven't placed any orders yet."}
              </p>
              <Link to="/" className="shop-now-btn">
                Start Shopping
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Orders;
