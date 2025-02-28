const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/user");
const Category = require("./models/category");
const Product = require("./models/product");
const Cart = require("./models/cart");
const Order = require("./models/order");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB connected successfully");
};

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Cart.deleteMany({});
  await Order.deleteMany({});

  // Insert Users
  const users = await User.insertMany([
    {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "$2b$10$XDK9jS5s7p49uuyD7o/7mO3r5fH8kM5k6l7mN8o9p0q1r2s3t4u5v",
      createdAt: new Date("2025-02-28T10:00:00Z"),
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      password: "$2b$10$XDK9jS5s7p49uuyD7o/7mO3r5fH8kM5k6l7mN8o9p0q1r2s3t4u5v",
      createdAt: new Date("2025-02-28T10:05:00Z"),
    },
  ]);

  // Insert Categories
  const categories = await Category.insertMany([
    { name: "Electronics", createdAt: new Date("2025-02-28T10:10:00Z") },
    { name: "Toys", createdAt: new Date("2025-02-28T10:15:00Z") },
    { name: "Books", createdAt: new Date("2025-02-28T10:20:00Z") },
    { name: "Clothing", createdAt: new Date("2025-02-28T10:25:00Z") },
  ]);

  // Insert Products
  const products = await Product.insertMany([
    {
      _id: "65e0f1b2c3d4e5f6a7b8c9d6",
      name: "Laptop",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: 999.99,
      description:
        "High-performance laptop for work and play with a 15.6-inch display and 16GB RAM.",
      rating: 4.5,
      category: "65e0f1b2c3d4e5f6a7b8c9d2", // Electronics
      isAvailable: true,
      specs: {
        material: "Aluminum and Plastic",
        sizes: ["13-inch", "15-inch"],
        colors: ["Silver", "Black"],
        care: "Handle with care, avoid liquid exposure",
      },
      reviews: [
        {
          user: "65e0f1b2c3d4e5f6a7b8c9d0", // John Doe
          rating: 5,
          comment: "Excellent performance, great battery life!",
          createdAt: "2025-02-28T12:00:00Z",
        },
      ],
      createdAt: "2025-02-28T11:00:00Z",
    },
    {
      _id: "65e0f1b2c3d4e5f6a7b8c9d7",
      name: "Headphones",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: 89.99,
      description:
        "Noise-canceling over-ear headphones with premium sound quality.",
      rating: 4.8,
      category: "65e0f1b2c3d4e5f6a7b8c9d2", // Electronics
      isAvailable: true,
      specs: {
        material: "Plastic and Leatherette",
        sizes: ["One Size"],
        colors: ["Black", "White", "Blue"],
        care: "Wipe with a dry cloth",
      },
      reviews: [
        {
          user: "65e0f1b2c3d4e5f6a7b8c9d1", // Jane Smith
          rating: 4.5,
          comment: "Great sound, very comfortable for long use.",
          createdAt: "2025-02-28T12:30:00Z",
        },
      ],
      createdAt: "2025-02-28T11:05:00Z",
    },
    {
      _id: "65e0f1b2c3d4e5f6a7b8c9d8",
      name: "Action Figure",
      image:
        "https://images.unsplash.com/photo-1595432595244-3e4f6b0e73b7?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: 19.99,
      description: "Collectible superhero action figure, detailed and durable.",
      rating: 4.2,
      category: "65e0f1b2c3d4e5f6a7b8c9d3", // Toys
      isAvailable: true,
      specs: {
        material: "Plastic",
        sizes: ["7-inch"],
        colors: ["Red", "Blue"],
        care: "Keep away from direct sunlight",
      },
      reviews: [
        {
          user: "65e0f1b2c3d4e5f6a7b8c9d0",
          rating: 4,
          comment: "Perfect for collectors, great detail.",
          createdAt: "2025-02-28T13:00:00Z",
        },
      ],
      createdAt: "2025-02-28T11:10:00Z",
    },
    {
      _id: "65e0f1b2c3d4e5f6a7b8c9d9",
      name: "Novel",
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: 15.99,
      description: "Bestselling mystery novel by a renowned author.",
      rating: 4.7,
      category: "65e0f1b2c3d4e5f6a7b8c9d4", // Books
      isAvailable: true,
      specs: {
        material: "Paper",
        sizes: ["6x9 inches"],
        colors: ["N/A"],
        care: "Store in a dry place",
      },
      reviews: [
        {
          user: "65e0f1b2c3d4e5f6a7b8c9d1",
          rating: 5,
          comment: "Thrilling read, couldn’t put it down!",
          createdAt: "2025-02-28T13:30:00Z",
        },
      ],
      createdAt: "2025-02-28T11:15:00Z",
    },
    {
      _id: "65e0f1b2c3d4e5f6a7b8c9da",
      name: "Classic Crew Neck T-Shirt",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: 19.99,
      description:
        "Soft and durable cotton t-shirt for everyday wear. Perfect for casual outings or workouts, available in multiple sizes and colors.",
      rating: 4,
      category: "65e0f1b2c3d4e5f6a7b8c9d5", // Clothing
      isAvailable: true,
      specs: {
        material: "100% Cotton",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "White", "Gray", "Navy"],
        care: "Machine washable, tumble dry low",
      },
      reviews: [
        {
          user: "65e0f1b2c3d4e5f6a7b8c9d0",
          rating: 4.5,
          comment: "Great quality and fits perfectly!",
          createdAt: "2025-02-28T14:00:00Z",
        },
      ],
      createdAt: "2025-02-28T11:20:00Z",
    },
  ]);

  // Insert Carts
  await Cart.insertMany([
    {
      user: users[0]._id,
      items: [
        {
          product: products[0]._id,
          quantity: 1,
          color: "Silver",
          size: "15-inch",
          addedAt: new Date("2025-02-28T15:00:00Z"),
        },
        {
          product: products[4]._id,
          quantity: 2,
          color: "Black",
          size: "M",
          addedAt: new Date("2025-02-28T15:05:00Z"),
        },
      ],
      createdAt: new Date("2025-02-28T15:00:00Z"),
    },
  ]);

  // Insert Orders
  await Order.insertMany([
    {
      user: users[0]._id,
      totalAmount: 1109.97,
      status: "shipped",
      items: [
        {
          product: products[0]._id,
          quantity: 1,
          price: 999.99,
          color: "Silver",
          size: "15-inch",
        },
        {
          product: products[4]._id,
          quantity: 2,
          price: 19.99,
          color: "Black",
          size: "M",
        },
      ],
      createdAt: new Date("2025-02-28T16:00:00Z"),
      updatedAt: new Date("2025-03-01T09:00:00Z"),
    },
  ]);

  console.log("Database seeded successfully");
  process.exit(0);
};

seedData().catch(console.error);
