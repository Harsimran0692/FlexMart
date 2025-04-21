import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  MapPin,
  Plus,
  CreditCard,
} from "lucide-react";

import "../style/Checkout.css";

export default function CheckoutPage() {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [cart, setCart] = useState({ items: [], totalItems: 0 });
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [loadingCart, setLoadingCart] = useState(true);
  const [errorAddresses, setErrorAddresses] = useState(null);
  const [errorCart, setErrorCart] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardholderName: "",
    expiry: "",
    cvv: "",
  });
  const [paymentErrors, setPaymentErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems: selectedCartItems = [], subtotal: passedSubtotal = 0 } =
    location.state || {};

  // Auto-clear errors after 3 seconds
  useEffect(() => {
    if (orderError || errorAddresses || errorCart) {
      const timer = setTimeout(() => {
        setOrderError(null);
        setErrorAddresses(null);
        setErrorCart(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [orderError, errorAddresses, errorCart]);

  // Fetch addresses from API
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          "https://flexmart-backend.onrender.com/api/addresses",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch addresses");
        }

        const data = await response.json();
        const formattedAddresses = data.addresses.map((addr) => ({
          id: addr._id,
          name: addr.name,
          address: addr.address,
          phone: addr.phone,
          email: addr.email || "N/A",
          isDefault: addr.isDefault || false,
        }));

        setAddresses(formattedAddresses);
        setLoadingAddresses(false);
      } catch (err) {
        console.error("Fetch addresses error:", err.message);
        setErrorAddresses(err.message);
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, []);

  // Fetch cart items and filter based on selected items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          "https://flexmart-backend.onrender.com/api/cart/items",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }

        const data = await response.json();
        const cartData = data.cart || { items: [], totalItems: 0 };

        const itemsToUse =
          selectedCartItems.length > 0 ? selectedCartItems : cartData.items;

        setCart({
          items: itemsToUse,
          totalItems: itemsToUse.reduce((sum, item) => sum + item.quantity, 0),
        });
        setLoadingCart(false);
      } catch (err) {
        console.error("Fetch cart error:", err.message);
        setErrorCart(err.message);
        setLoadingCart(false);
      }
    };

    fetchCart();
  }, [selectedCartItems]);

  const handleAddressSelect = (addressId) => {
    setSelectedAddress(addressId);
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value.replace(/\D/g, "").slice(0, 16);
      formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, "$1 ");
    }

    if (name === "expiry") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(
          2
        )}`;
      }
    }

    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setPaymentDetails((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const validatePaymentDetails = () => {
    const errors = {};
    const cardNumberDigits = paymentDetails.cardNumber.replace(/\s/g, "");
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (!cardNumberDigits || cardNumberDigits.length !== 16) {
      errors.cardNumber = "Card number must be 16 digits";
    }

    if (!paymentDetails.cardholderName.trim()) {
      errors.cardholderName = "Cardholder name is required";
    }

    if (!paymentDetails.expiry || !expiryRegex.test(paymentDetails.expiry)) {
      errors.expiry = "Expiry date must be in MM/YY format";
    } else {
      const [month, year] = paymentDetails.expiry.split("/").map(Number);
      if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        errors.expiry = "Card has expired";
      }
    }

    if (!paymentDetails.cvv || !/^\d{3,4}$/.test(paymentDetails.cvv)) {
      errors.cvv = "CVV must be 3 or 4 digits";
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = async () => {
    setOrderError(null);

    if (!selectedAddress) {
      setOrderError("Please select a delivery address");
      return;
    }

    if (cart.items.length === 0) {
      setOrderError("No items selected for checkout");
      return;
    }

    if (!validatePaymentDetails()) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://flexmart-backend.onrender.com/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            addressId: selectedAddress,
            items: cart.items.map((item) => ({
              product: item.product._id,
              quantity: item.quantity,
              price: item.price,
              color: item.color || "",
              size: item.size || "",
            })),
            paymentDetails: {
              cardNumberLast4: paymentDetails.cardNumber
                .replace(/\s/g, "")
                .slice(-4),
              cardholderName: paymentDetails.cardholderName,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to create order");
      }

      await response.json();
      setShowConfirmation(true);
    } catch (error) {
      console.error("Checkout error:", error.message);
      setOrderError(error.message);
    }
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    setCart({ items: [], totalItems: 0 });
    setSelectedAddress(null);
    setPaymentDetails({
      cardNumber: "",
      cardholderName: "",
      expiry: "",
      cvv: "",
    });
    navigate("/");
  };

  const displayedAddresses = showAllAddresses
    ? addresses
    : addresses.slice(0, 3);

  const subtotal = cart.items.reduce(
    (sum, item) => sum + (item.price - (item.discount || 0)) * item.quantity,
    0
  );
  const shipping = 0;
  const tax = 0;
  const giftCertificate = 35.0;
  const orderTotal = subtotal + shipping + tax - giftCertificate;

  if (loadingAddresses) {
    return <div>Loading addresses...</div>;
  }

  if (errorAddresses) {
    return (
      <div className="error-popup">
        Error fetching addresses: {errorAddresses}
      </div>
    );
  }

  if (loadingCart) {
    return <div>Loading cart...</div>;
  }

  if (errorCart) {
    return <div className="error-popup">Error fetching cart: {errorCart}</div>;
  }

  return (
    <div className="container">
      <h1 className="page-title">Checkout</h1>

      {orderError && (
        <div className="error-popup">
          <p>{orderError}</p>
        </div>
      )}

      <div className="checkout-grid">
        <div className="checkout-main">
          {/* Shipping Section */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <span className="step-number">1</span>
                Shipping Information
              </h2>
            </div>
            <div className="card-content">
              <h3 className="section-subtitle">Select a delivery address</h3>

              <div className="address-list">
                {displayedAddresses.length > 0 ? (
                  displayedAddresses.map((address) => (
                    <div
                      key={address.id}
                      className={`address-item ${
                        selectedAddress === address.id ? "selected" : ""
                      }`}
                      onClick={() => handleAddressSelect(address.id)}
                    >
                      <div className="address-radio">
                        <input
                          type="radio"
                          name="address"
                          id={`address-${address.id}`}
                          checked={selectedAddress === address.id}
                          onChange={() => handleAddressSelect(address.id)}
                        />
                        <label
                          htmlFor={`address-${address.id}`}
                          className="radio-label"
                        ></label>
                      </div>
                      <div className="address-content">
                        <div className="address-header">
                          <span className="address-name">{address.name}</span>
                          {address.isDefault && (
                            <span className="default-badge">Default</span>
                          )}
                        </div>
                        <p className="address-text">{address.address}</p>
                        <p className="address-phone">Phone: {address.phone}</p>
                        {address.email && (
                          <p className="address-email">
                            Email: {address.email}
                          </p>
                        )}

                        <div className="address-actions">
                          <button className="text-button">
                            <Edit className="icon-small" />
                            Edit
                          </button>
                          <span className="separator"></span>
                          <button className="text-button">
                            <MapPin className="icon-small" />
                            Add delivery instructions
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No addresses found. Please add a new address.</p>
                )}
              </div>

              {addresses.length > 3 && (
                <button
                  className="show-more-button"
                  onClick={() => setShowAllAddresses(!showAllAddresses)}
                >
                  {showAllAddresses ? (
                    <span className="button-with-icon">
                      Show fewer addresses <ChevronUp className="icon-small" />
                    </span>
                  ) : (
                    <span className="button-with-icon">
                      Show more addresses <ChevronDown className="icon-small" />
                    </span>
                  )}
                </button>
              )}

              <div className="address-actions-container">
                <button className="secondary-button">
                  <Plus className="icon-small" />
                  Add a new delivery address
                </button>

                <button
                  className="primary-button"
                  disabled={!selectedAddress || cart.items.length === 0}
                  onClick={handleCheckout}
                >
                  Deliver to this address
                </button>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <span className="step-number">2</span>
                Payment Information
              </h2>
            </div>
            <div className="card-content">
              <div className="payment-form">
                <div className="form-row full-width-row">
                  <div className="form-group full-width">
                    <label htmlFor="card-number" className="form-label">
                      Card Number
                    </label>
                    <div className="input-wrapper">
                      <CreditCard className="input-icon" />
                      <input
                        id="card-number"
                        name="cardNumber"
                        className={`form-input ${
                          paymentErrors.cardNumber ? "error" : ""
                        }`}
                        placeholder="1234 5678 9012 3456"
                        value={paymentDetails.cardNumber}
                        onChange={handlePaymentChange}
                        maxLength={19}
                      />
                    </div>
                    {paymentErrors.cardNumber && (
                      <p className="error-message">
                        {paymentErrors.cardNumber}
                      </p>
                    )}
                  </div>
                </div>
                <div className="form-row full-width-row">
                  <div className="form-group full-width">
                    <label htmlFor="cardholder-name" className="form-label">
                      Cardholder Name
                    </label>
                    <div className="input-wrapper">
                      <input
                        id="cardholder-name"
                        name="cardholderName"
                        className={`form-input ${
                          paymentErrors.cardholderName ? "error" : ""
                        }`}
                        placeholder="John Doe"
                        value={paymentDetails.cardholderName}
                        onChange={handlePaymentChange}
                      />
                    </div>
                    {paymentErrors.cardholderName && (
                      <p className="error-message">
                        {paymentErrors.cardholderName}
                      </p>
                    )}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiry" className="form-label">
                      Expiry Date
                    </label>
                    <div className="input-wrapper">
                      <input
                        id="expiry"
                        name="expiry"
                        className={`form-input ${
                          paymentErrors.expiry ? "error" : ""
                        }`}
                        placeholder="MM/YY"
                        value={paymentDetails.expiry}
                        onChange={handlePaymentChange}
                        maxLength={5}
                      />
                    </div>
                    {paymentErrors.expiry && (
                      <p className="error-message">{paymentErrors.expiry}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvv" className="form-label">
                      CVV
                    </label>
                    <div className="input-wrapper">
                      <input
                        id="cvv"
                        name="cvv"
                        className={`form-input ${
                          paymentErrors.cvv ? "error" : ""
                        }`}
                        placeholder="123"
                        value={paymentDetails.cvv}
                        onChange={handlePaymentChange}
                        maxLength={4}
                      />
                    </div>
                    {paymentErrors.cvv && (
                      <p className="error-message">{paymentErrors.cvv}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="checkout-sidebar">
          <div className="card sticky">
            <div className="card-header">
              <h2 className="card-title">Order Summary</h2>
            </div>
            <div className="card-content">
              <div className="summary-list">
                {cart.items.length > 0 ? (
                  <>
                    <div className="summary-item">
                      <span>Items ({cart.totalItems}):</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                      <span>Shipping & Handling:</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                      <span>Estimated GST/HST:</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                      <span>Estimated PST/RST/QST:</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>

                    <div className="divider"></div>

                    <div className="summary-item subtotal">
                      <span>Total:</span>
                      <span>${(subtotal + shipping + tax).toFixed(2)}</span>
                    </div>
                    <div className="summary-item discount">
                      <span>Gift Certificates:</span>
                      <span>-${giftCertificate.toFixed(2)}</span>
                    </div>

                    <div className="divider"></div>

                    <div className="summary-item total">
                      <span>Order Total:</span>
                      <span>${orderTotal.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <p>No items selected for checkout.</p>
                )}

                <button
                  className="primary-button order-button"
                  disabled={!selectedAddress || cart.items.length === 0}
                  onClick={handleCheckout}
                >
                  Place your order
                </button>

                <p className="terms-text">
                  By placing your order, you agree to our Terms of Service and
                  Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Order Confirmed!</h2>
            <p>Your order has been successfully placed.</p>
            <p>Order Total: ${orderTotal.toFixed(2)}</p>
            <p>Items: {cart.totalItems}</p>
            <button className="primary-button" onClick={closeConfirmation}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
