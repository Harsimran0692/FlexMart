// routes/categories.js
const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const Product = require("../models/product");
const auth = require("../middleware/auth");

router.get("/all", async (req, res) => {
  try {
    const categories = await Category.find().lean();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().lean();
    const limitCategories = categories.slice(0, 4);
    const limitSubCategories = limitCategories.map((categories) => ({
      ...categories,
      type: categories.type.slice(0, 4),
    }));
    res.json(limitSubCategories);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/subcategory/:id/", async (req, res) => {
  const id = req.params.id;
  try {
    const category = await Category.findById(id).lean();
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:name", async (req, res) => {
  try {
    const category = await Category.findOne({
      name: req.params.name.toLowerCase(),
    }).populate("products");
    if (!category) return res.status(404).json({ msg: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
      type: req.body.type,
      image: req.body.image,
    });
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ msg: "Category not found" });

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        type: req.body.type,
        image: req.body.image,
      },
      { new: true, runValidators: true }
    );
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ msg: "Category not found" });

    await Category.findByIdAndDelete(req.params.id);
    res.json({ msg: "Category deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
