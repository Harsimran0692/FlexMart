const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/category/:categoryId", async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.categoryId,
    }).populate("category");
    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category reviews.user"
    );
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).json({ msg: "Category not found" });

    const product = new Product({ ...req.body, category: category._id });
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("category reviews.user");
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Product deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
