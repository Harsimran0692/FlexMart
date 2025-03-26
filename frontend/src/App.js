import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import "./App.css";
import { useSelector } from "react-redux"; // Import useSelector
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ProductPage from "./pages/ProductPage";
import SubCategories from "./pages/SubCategories";
import Profile from "./pages/Profile";

// Component to restrict access for signed-in users
const RestrictSignedIn = () => {
  const loggedInUser = useSelector((state) => state.loginUser.value);
  const token = localStorage.getItem("token");

  // Check if user is signed in
  const isSignedIn = token && loggedInUser !== "Hello, SignIn";

  return isSignedIn ? <Navigate to="/" replace /> : <Outlet />;
};

// Component to protect routes for signed-out users (optional, for reference)
const ProtectedRoute = () => {
  const loggedInUser = useSelector((state) => state.loginUser.value);
  const token = localStorage.getItem("token");
  const isSignedIn = token && loggedInUser !== "Hello, SignIn";

  return isSignedIn ? <Outlet /> : <Navigate to="/signin" replace />;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            {/* Restrict signed-in users from accessing signin/signup */}
            <Route element={<RestrictSignedIn />}>
              <Route path="/signin" element={<Login />} />
              <Route path="/signup" element={<Register />} />
            </Route>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            {/* Optional: Protect profile route for signed-in users only */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route
              path="/categories/:subcategory/:id"
              element={<SubCategories />}
            />
            <Route
              path="/products/:category/:subcategory"
              element={<ProductPage />}
            />
            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
