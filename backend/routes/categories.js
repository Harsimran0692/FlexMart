const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/:name", async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.params.name });
    if (!category) return res.status(404).json({ msg: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/:name", auth, async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.params.name });
    if (!category) return res.status(404).json({ msg: "Category not found" });

    const updatedCategory = await Category.findOneAndUpdate(
      { name: req.params.name },
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/:name", auth, async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.params.name });
    if (!category) return res.status(404).json({ msg: "Category not found" });

    await Category.findOneAndDelete({ name: req.params.name });
    res.json({ msg: "Category deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
