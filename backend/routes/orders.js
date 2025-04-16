const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/order");
const Cart = require("../models/cart");
const Addresses = require("../models/address"); // Ensure this model exists
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    const { addressId, items, paymentDetails } = req.body;

    if (!addressId || !items || !items.length) {
      return res.status(400).json({ msg: "Address and items are required" });
    }

    // Validate addressId
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ msg: "Invalid address ID format" });
    }

    // Validate items
    const validItems = items.map((item) => {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        throw new Error(`Invalid product ID: ${item.product}`);
      }
      return {
        product: new mongoose.Types.ObjectId(item.product),
        quantity: parseInt(item.quantity) || 1,
        price: parseFloat(item.price) || 0,
        color: item.color || "",
        size: item.size || "",
      };
    });

    // Calculate total amount
    const totalAmount = validItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    // Fetch address from user's addresses
    const userAddresses = await Addresses.findOne({ userId: req.user.id });
    if (!userAddresses) {
      return res.status(400).json({ msg: "No addresses found for user" });
    }

    const selectedAddress = userAddresses.addresses.find(
      (addr) => addr._id.toString() === addressId
    );
    if (!selectedAddress) {
      return res.status(400).json({ msg: "Address not found" });
    }

    // Create order
    const order = new Order({
      user: req.user.id,
      totalAmount,
      items: validItems,
      address: {
        id: addressId, // Store as string
        name: selectedAddress.name,
        address: selectedAddress.address,
        phone: selectedAddress.phone,
        email: selectedAddress.email || "N/A",
      },
      paymentDetails: {
        cardNumberLast4: paymentDetails?.cardNumberLast4 || "",
        cardholderName: paymentDetails?.cardholderName || "",
      },
    });

    await order.save();

    // Remove selected items from cart
    const cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items = cart.items.filter(
        (item) =>
          !items.some(
            (selected) => selected.product === item.product.toString()
          )
      );
      cart.totalItems = cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      await cart.save();
    }

    res.json(order);
  } catch (error) {
    console.error("Order creation error:", error.message);
    res.status(400).json({ msg: error.message || "Server error" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "items.product"
    );
    res.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

router.patch("/:orderId", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ msg: "Order not found" });
    if (order.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    order.status = status;
    order.updatedAt = Date.now();
    await order.save();
    res.json(order);
  } catch (error) {
    console.error("Update order error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
