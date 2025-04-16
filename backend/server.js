const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const cartRoutes = require("./routes/carts");
const orderRoutes = require("./routes/orders");
const addressRoute = require("./routes/addresses");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const app = express();

// Connect to database first
connectDB();

// Serve static files before session (optional, for assets)
app.use(express.static("public"));

// CORS configuration (before session to handle preflight requests)
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Crucial: allows cookies to be sent
  })
);

// Middleware
app.use(express.json());

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "fallback-secret",
  resave: false,
  saveUninitialized: true, // Creates session on first request
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60,
    autoRemove: "native",
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: false, // False for local dev (HTTP)
    sameSite: "lax", // Works for same-origin; use "none" with secure: true in prod
    path: "/",
  },
  name: "connect.sid",
});

// Debug middleware
// app.use((req, res, next) => {
//   console.log(
//     `Request: ${req.method} ${req.path}, SessionID: ${req.sessionID}, Cookie: ${
//       req.headers.cookie || "none"
//     }`
//   );
//   next();
// });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/addresses", addressRoute);

// Default route
// app.get("/", sessionMiddleware, (req, res) => {
//   const sessionId = req.sessionID; // Get the session ID
//   res.json({ message: "Welcome to the homepage", sessionId });
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
