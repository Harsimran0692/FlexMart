import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/Profile.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoader(true);
      try {
        const token = localStorage.getItem("token");
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

  return (
    <div className={`profile-page ${loader ? "loading" : ""}`}>
      {loader && (
        <div className="loader">
          <span>Loading...</span>
        </div>
      )}
      {error && <div className="alert error">{error}</div>}
      <div className="profile-content">
        <header className="profile-header">
          <h1>Your Orders</h1>
        </header>
        <section className="orders-section">
          {orders.length > 0 ? (
            <div className="orders-grid">
              {orders.map((order) => (
                <div key={order.id} className="order-item">
                  <div className="order-info">
                    <span className="order-id">Order #{order.id}</span>
                    <span
                      className={`order-status ${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="order-meta">
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Total:</strong> ${order.total.toFixed(2)}
                    </p>
                    <p>
                      <strong>Items:</strong> {order.items.length}
                    </p>
                  </div>
                  <Link to={`/order/${order.id}`} className="details-btn">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No past orders found.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default Orders;
