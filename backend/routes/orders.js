const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Cart = require("../models/cart");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );
    if (!cart || !cart.items.length)
      return res.status(400).json({ msg: "Cart is empty" });

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );
    const order = new Order({
      user: req.user.id,
      totalAmount,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
        color: item.color,
        size: item.size,
      })),
    });
    await order.save();

    // Clear cart after order
    cart.items = [];
    await cart.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "items.product"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/:orderId", auth, async (req, res) => {
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
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
