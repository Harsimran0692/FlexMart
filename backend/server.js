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
require("dotenv").config();

const app = express();

// Connect to database
connectDB()
  .then(() => {
    console.log("MongoDB connection established");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1); // Exit if DB connection fails
  });

// Serve static files (optional, for assets)
app.use(express.static("public"));

// CORS configuration to allow all origins
app.use(
  cors({
    origin: "https://flex-mart-frontend.vercel.app", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Required for session cookies
  })
);

// Middleware
app.use(express.json());

// Session middleware (applied globally)
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "fallback-secret",
  resave: false,
  saveUninitialized: false, // Only create sessions for authenticated users
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60, // 24 hours
    autoRemove: "native",
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // True on Render (HTTPS)
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Cross-origin in prod
    path: "/",
  },
  name: "connect.sid",
});
app.use(sessionMiddleware);

// Debug middleware (uncomment for troubleshooting)
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

// Default route (for testing)
app.get("/", (req, res) => {
  const sessionId = req.sessionID;
  res.json({ message: "Welcome to the API", sessionId });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 5001; // Align with your .env PORT=5001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
