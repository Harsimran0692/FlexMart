const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );
    if (!cart) return res.status(404).json({ msg: "Cart not found" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const cart = new Cart({ user: req.user.id, items: [] });
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/items", auth, async (req, res) => {
  try {
    const { productId, quantity, color, size } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    cart.items.push({ product: productId, quantity, color, size });
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/items/:itemId", auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ msg: "Cart item not found" });

    item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/items/:itemId", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    cart.items.pull({ _id: req.params.itemId });
    await cart.save();
    res.json({ msg: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
