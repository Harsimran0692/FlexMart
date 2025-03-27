// routes/products.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/category");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const query = req.query.deal ? { isDeal: true } : {};
    const products = await Product.find(query).populate("category");
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/:subcategory", async (req, res) => {
  const subCategory = req.params.subcategory;

  // Basic validation
  if (!subCategory || typeof subCategory !== "string") {
    return res.status(400).json({ message: "Invalid subcategory provided" });
  }

  try {
    // Case-insensitive search using regex
    const products = await Product.find({
      subCategory: { $regex: new RegExp(`^${subCategory}$`, "i") },
    }).lean();

    // Check if any products were found
    if (products.length === 0) {
      return res.status(404).json({
        message: `No products found for subcategory '${subCategory}'`,
      });
    }

    // Return success response with consistent format
    res.status(200).json({
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/products/category/:categoryId - Fetch products by category ID with optional sub-section
router.get("/category/:categoryId", async (req, res) => {
  try {
    let query = { category: req.params.categoryId };
    if (req.query.category) {
      query.category = req.query.category.toLowerCase(); // Filter by sub-section (e.g., "laptop")
    }
    const products = await Product.find(query).populate("category").lean(); // Use lean() for better performance
    res.json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /api/products/category-name/:categoryName - Fetch products by category name with optional sub-section
router.get("/category-name/:categoryName", async (req, res) => {
  try {
    // Fetch the category by name to get its ID
    const category = await Category.findOne({
      name: req.params.categoryName.toLowerCase(),
    });
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    let query = { category: category._id };
    if (req.query.subSection) {
      query.subSection = req.query.subSection.toLowerCase(); // Filter by sub-section (e.g., "laptop")
    }
    const products = await Product.find(query).populate("category").lean(); // Use lean() for better performance
    res.json(products);
  } catch (error) {
    console.error("Error fetching products by category name:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/test/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category reviews.user"
    );
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).json({ msg: "Category not found" });

    const product = new Product({
      ...req.body,
      category: category._id,
      subSection: req.body.subSection || null, // Use subSection for products (e.g., "laptop")
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, subSection: req.body.subSection || null },
      { new: true, runValidators: true }
    ).populate("category reviews.user");
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
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
    console.error("Error deleting product:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
