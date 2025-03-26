const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Cart = require("../models/cart");
const Product = require("../models/Product");
const User = require("../models/user");
const TokenDecoder = require("../helper/tokenDecoder");
require("dotenv").config();

// GET all carts (for admin/debug purposes)
router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate("user") // Populate user details if present
      .populate("items.product"); // Populate product details
    if (carts.length === 0) {
      return res.status(404).json({ msg: "No carts found" });
    }
    res.json(carts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET user's cart items
router.get("/items", async (req, res) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token provided" });
    }
    const token = authHeader.split(" ")[1];

    // Decode token to get user ID
    let userId;
    try {
      userId = TokenDecoder(token); // Assuming TokenDecoder returns user ID
    } catch (err) {
      return res.status(401).json({ msg: "Invalid or expired token" });
    }

    // Find cart for the user
    let cart = await Cart.findOne({ user: userId })
      .populate("items.product") // Populate product details
      .populate("user"); // Optional: Populate user details if needed

    if (!cart) {
      // If no cart exists, return an empty cart (consistent with frontend reset)
      cart = {
        items: [],
        totalItems: 0,
      };
      return res.json({ cart });
    }

    // Ensure totalItems is included (assuming Cart model has virtuals enabled)
    const populatedCart = {
      items: cart.items,
      totalItems: cart.totalItems, // From virtual field or manual calculation
    };

    res.json({ cart: populatedCart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// router.get("/cart", async (req, res) => {
//   const cart = await Cart.findOne({ user: userId }).populate("items.product");
//   if (!cart) throw new Error("Cart not found");

//   return cart;
// });

// POST create a new cart (for logged-in or guest users)
router.post("/", async (req, res) => {
  try {
    let cartIdentifier;
    try {
      cartIdentifier = getCartIdentifier(req);
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }

    // Only set sessionId if no user is present
    if (req.body.sessionId && !cartIdentifier.user) {
      cartIdentifier.sessionId = req.body.sessionId;
    }

    const cartData = {
      items: [],
      ...cartIdentifier,
    };

    const cart = new Cart(cartData);
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// POST add item to cart
router.post("/items", async (req, res) => {
  try {
    const {
      productId,
      quantity = 1, // Default to 1 if not provided
      sessionId,
      token,
      color,
      size,
      availability,
    } = req.body;

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res
        .status(400)
        .json({ msg: "Quantity must be a positive integer" });
    }

    // Determine userId from token (if provided)
    let userId;
    if (token) {
      try {
        userId = TokenDecoder(token); // Assuming this returns user ID or throws error
      } catch (err) {
        return res.status(401).json({ msg: "Invalid token" });
      }
    }

    // Find or create cart based on userId or sessionId
    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
      if (!cart) {
        cart = new Cart({
          user: userId,
          items: [],
          status: "active",
        });
      }
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
      if (!cart) {
        cart = new Cart({
          sessionId,
          items: [],
          status: "active",
        });
      }
    } else {
      return res.status(400).json({ msg: "User ID or session ID required" });
    }

    // Fetch product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Optional: Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({ msg: "Insufficient stock" });
    }

    // Check if the product already exists in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        discount: product.discount || 0,
        name: product.name,
        availability: availability ? "In Stock" : "Out of Stock",
        color,
        size,
      });
    }

    // Update lastModified
    cart.lastModified = Date.now();

    // Save the cart
    await cart.save();

    // Populate user data and return the cart
    const populatedCart = await Cart.findById(cart._id)
      .populate("user") // Populate user details if needed
      .populate("items.product"); // Optional: Populate product details for richer UI data

    // totalItems is automatically included due to virtual and toJSON: { virtuals: true }
    res.json({
      success: true,
      cart: populatedCart,
      totalItems: populatedCart.totalItems, // Explicitly highlight totalItems for UI
    });
  } catch (error) {
    console.error("Error in cart route:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// PUT update cart item quantity
router.put("/items/:itemId", async (req, res) => {
  try {
    const { quantity } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token provided" });
    }
    const token = authHeader.split(" ")[1];

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity < 0) {
      return res
        .status(400)
        .json({ msg: "Quantity must be a non-negative integer" });
    }

    // Get cart identifier
    let cartIdentifier;
    try {
      cartIdentifier = TokenDecoder(token);
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }

    // Find the cart
    const cart = await Cart.findOne({ user: cartIdentifier }).populate(
      "items.product"
    );
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    // Find the cart item
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ msg: "Cart item not found" });

    // If quantity is 0, remove the item
    if (quantity === 0) {
      cart.items.pull({ _id: req.params.itemId });
    } else {
      // Fetch the product to check stock
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ msg: "Product not found" });
      }

      // Check stock availability
      if (product.stock < quantity) {
        return res.status(400).json({
          msg: `Insufficient stock. Only ${product.stock} items available.`,
        });
      }

      // Update quantity and availability
      item.quantity = quantity;
      item.availability = product.stock > 0 ? "In Stock" : "Out of Stock";
    }

    // Update lastModified (handled by pre-save hook, but ensure it's triggered)
    cart.lastModified = Date.now();

    // Save the cart
    await cart.save();

    // Re-populate product details for the response
    const populatedCart = await Cart.findById(cart._id).populate(
      "items.product"
    );

    // Format response to match GET /items
    const responseCart = {
      items: populatedCart.items,
      totalItems: populatedCart.totalItems,
    };

    res.json(responseCart);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// DELETE remove item from cart
router.delete("/items/:itemId", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    // Get cart identifier
    let cartIdentifier;
    try {
      cartIdentifier = TokenDecoder(token);
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }

    // Find the cart
    const cart = await Cart.findOne({ user: cartIdentifier });
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    // Find the cart item
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ msg: "Cart item not found" });

    // Remove the item
    cart.items.pull({ _id: req.params.itemId });

    // Update lastModified (handled by pre-save hook, but ensure it's triggered)
    cart.lastModified = Date.now();

    // Save the cart
    await cart.save();

    // Re-populate product details for the response
    const populatedCart = await Cart.findById(cart._id).populate(
      "items.product"
    );

    // Format response to match GET /items
    const responseCart = {
      items: populatedCart.items,
      totalItems: populatedCart.totalItems,
    };

    res.json({ msg: "Item removed from cart", cart: responseCart });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
