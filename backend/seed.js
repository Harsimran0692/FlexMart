const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/user");
const Category = require("./models/category");
const Product = require("./models/Product");
const Cart = require("./models/cart");
const Order = require("./models/order");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
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
  // Clear existing data
  await Category.deleteMany({});

  const categories = await Category.insertMany([
    {
      name: "Electronics",
      type: [
        {
          name: "Laptops",
          image:
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200",
        },
        {
          name: "Smartphones",
          image:
            "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=1200",
        },
        {
          name: "Headphones",
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200",
        },
        {
          name: "Cameras",
          image:
            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1200",
        },
        {
          name: "Televisions",
          image:
            "https://images.unsplash.com/photo-1593787818044-9f4f4942a8e1?q=80&w=1200",
        },
        {
          name: "Smartwatches",
          image:
            "https://images.unsplash.com/photo-1523275846578-8f5f872a630d?q=80&w=1200",
        },
        {
          name: "Tablets",
          image:
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1200",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200",
      createdAt: new Date("2025-02-28T10:10:00Z"),
    },
    {
      name: "Clothing",
      type: [
        {
          name: "T-Shirts",
          image:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200",
        },
        {
          name: "Jeans",
          image:
            "https://images.unsplash.com/photo-1542272604-787c03361a5f?q=80&w=1200",
        },
        {
          name: "Jackets",
          image:
            "https://images.unsplash.com/photo-1551489186-c4f47d57aace?q=80&w=1200",
        },
        {
          name: "Dresses",
          image:
            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200",
        },
        {
          name: "Shoes",
          image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200",
        },
        {
          name: "Sweaters",
          image:
            "https://images.unsplash.com/photo-1578926375605-e5d1e9dfe64f?q=80&w=1200",
        },
        {
          name: "Accessories",
          image:
            "https://images.unsplash.com/photo-1606768666853-52f0d96dae21?q=80&w=1200",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200",
      createdAt: new Date("2025-02-28T10:25:00Z"),
    },
    {
      name: "Books",
      type: [
        {
          name: "Fiction",
          image:
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1200",
        },
        {
          name: "Non-Fiction",
          image:
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200",
        },
        {
          name: "Children’s Books",
          image:
            "https://images.unsplash.com/photo-1497637265183-a99ff92ac4f2?q=80&w=1200",
        },
        {
          name: "Textbooks",
          image:
            "https://images.unsplash.com/photo-1511556820784-56d4e25df81b?q=80&w=1200",
        },
        {
          name: "Comics",
          image:
            "https://images.unsplash.com/photo-1590428596159-8e8a2b5ebfc0?q=80&w=1200",
        },
        {
          name: "Biographies",
          image:
            "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1200",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1200",
      createdAt: new Date("2025-02-28T10:20:00Z"),
    },
    {
      name: "Toys & Games",
      type: [
        {
          name: "Action Figures",
          image:
            "https://images.unsplash.com/photo-1595432595244-3e4f6b0e73b7?q=80&w=1200",
        },
        {
          name: "Board Games",
          image:
            "https://images.unsplash.com/photo-1517673132400-3e7d9a29b813?q=80&w=1200",
        },
        {
          name: "Puzzles",
          image:
            "https://images.unsplash.com/photo-1574226516832-42be3e9d3f3e?q=80&w=1200",
        },
        {
          name: "Dolls",
          image:
            "https://images.unsplash.com/photo-1517817745560-3a5a5ad0a51e?q=80&w=1200",
        },
        {
          name: "Building Sets",
          image:
            "https://images.unsplash.com/photo-1580936465115-13c738f6fcae?q=80&w=1200",
        },
        {
          name: "Remote Control Toys",
          image:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1595432595244-3e4f6b0e73b7?q=80&w=1200",
      createdAt: new Date("2025-02-28T10:15:00Z"),
    },
    {
      name: "Home & Kitchen",
      type: [
        {
          name: "Furniture",
          image:
            "https://images.unsplash.com/photo-1550581190-9e5f7f1f1e5b?q=80&w=1200",
        },
        {
          name: "Cookware",
          image:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
        },
        {
          name: "Appliances",
          image:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
        },
        {
          name: "Bedding",
          image:
            "https://images.unsplash.com/photo-1584100936597-4c5f63727b53?q=80&w=1200",
        },
        {
          name: "Decor",
          image:
            "https://images.unsplash.com/photo-1533090481720-856c6d5d7f5d?q=80&w=1200",
        },
        {
          name: "Lighting",
          image:
            "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1200",
        },
        {
          name: "Storage",
          image:
            "https://images.unsplash.com/photo-1582131503261-fca897aaec7b?q=80&w=1200",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1550581190-9e5f7f1f1e5b?q=80&w=1200",
      createdAt: new Date("2025-02-28T10:30:00Z"),
    },
    {
      name: "Sports & Outdoors",
      type: [
        {
          name: "Fitness Equipment",
          image:
            "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200",
        },
        {
          name: "Camping Gear",
          image:
            "https://images.unsplash.com/photo-1504280390367-5d8f8c9d8c5f?q=80&w=1200",
        },
        {
          name: "Bicycles",
          image:
            "https://images.unsplash.com/photo-1485965127652-5d4514e4fdda?q=80&w=1200",
        },
        {
          name: "Sportswear",
          image:
            "https://images.unsplash.com/photo-1551864235-57b0aa963e2b?q=80&w=1200",
        },
        {
          name: "Fishing Gear",
          image:
            "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1200",
        },
        {
          name: "Outdoor Games",
          image:
            "https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?q=80&w=1200",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200",
      createdAt: new Date("2025-02-28T10:35:00Z"),
    },
    {
      name: "Beauty & Personal Care",
      type: [
        {
          name: "Skincare",
          image:
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200",
        },
        {
          name: "Makeup",
          image:
            "https://images.unsplash.com/photo-1512496015851-a90fb38ba4a5?q=80&w=1200",
        },
        {
          name: "Haircare",
          image:
            "https://images.unsplash.com/photo-1608245449230-9ac4a9a4a8a5?q=80&w=1200",
        },
        {
          name: "Fragrances",
          image:
            "https://images.unsplash.com/photo-1572631382901-3bd6d7a3e730?q=80&w=1200",
        },
        {
          name: "Bath & Body",
          image:
            "https://images.unsplash.com/photo-1608245449230-9ac4a9a4a8a5?q=80&w=1200",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200",
      createdAt: new Date("2025-02-28T10:40:00Z"),
    },
    {
      name: "Automotive",
      type: [
        {
          name: "Car Accessories",
          image:
            "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1200",
        },
        {
          name: "Tires & Wheels",
          image:
            "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1200",
        },
        {
          name: "Tools & Equipment",
          image:
            "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1200",
        },
        {
          name: "Car Electronics",
          image:
            "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1200",
        },
        {
          name: "Motorcycle Parts",
          image:
            "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1200",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1200",
      createdAt: new Date("2025-02-28T10:45:00Z"),
    },
    {
      name: "Health & Household",
      type: [
        {
          name: "Vitamins",
          image:
            "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?q=80&w=1200",
        },
        {
          name: "Cleaning Supplies",
          image:
            "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?q=80&w=1200",
        },
        {
          name: "Personal Care",
          image:
            "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?q=80&w=1200",
        },
        {
          name: "Medical Supplies",
          image:
            "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?q=80&w=1200",
        },
        {
          name: "Baby Products",
          image:
            "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?q=80&w=1200",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?q=80&w=1200",
      createdAt: new Date("2025-02-28T10:50:00Z"),
    },
    {
      name: "Pet Supplies",
      type: [
        {
          name: "Dog Food",
          image:
            "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?q=80&w=1200",
        },
        {
          name: "Cat Toys",
          image:
            "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?q=80&w=1200",
        },
        {
          name: "Aquarium Supplies",
          image:
            "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?q=80&w=1200",
        },
        {
          name: "Pet Grooming",
          image:
            "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?q=80&w=1200",
        },
        {
          name: "Bird Cages",
          image:
            "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?q=80&w=1200",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?q=80&w=1200",
      createdAt: new Date("2025-02-28T10:55:00Z"),
    },
    {
      name: "Office Products",
      type: [
        {
          name: "Printers",
          image:
            "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1200",
        },
        {
          name: "Stationery",
          image:
            "https://images.unsplash.com/photo-1507473885765-8d63c0e812de?q=80&w=1200",
        },
        {
          name: "Office Chairs",
          image:
            "https://images.unsplash.com/photo-1505840717430-882943766a3e?q=80&w=1200",
        },
        {
          name: "Desks",
          image:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
        },
        {
          name: "Paper Supplies",
          image:
            "https://images.unsplash.com/photo-1507473885765-8d63c0e812de?q=80&w=1200",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1200",
      createdAt: new Date("2025-02-28T11:00:00Z"),
    },
    {
      name: "Grocery & Gourmet Food",
      type: [
        {
          name: "Snacks",
          image:
            "https://images.unsplash.com/photo-1496417263033-8e378e7e79a6?q=80&w=1200",
        },
        {
          name: "Beverages",
          image:
            "https://images.unsplash.com/photo-1605717541036-66f1370f765e?q=80&w=1200",
        },
        {
          name: "Organic Food",
          image:
            "https://images.unsplash.com/photo-1540420828642-fca2c5c18abe?q=80&w=1200",
        },
        {
          name: "Canned Goods",
          image:
            "https://images.unsplash.com/photo-1605717541036-66f1370f765e?q=80&w=1200",
        },
        {
          name: "Spices",
          image:
            "https://images.unsplash.com/photo-1605717541036-66f1370f765e?q=80&w=1200",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1496417263033-8e378e7e79a6?q=80&w=1200",
      createdAt: new Date("2025-02-28T11:05:00Z"),
    },
    {
      name: "Tools & Home Improvement",
      type: [
        {
          name: "Power Tools",
          image:
            "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1200",
        },
        {
          name: "Hand Tools",
          image:
            "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1200",
        },
        {
          name: "Plumbing",
          image:
            "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1200",
        },
        {
          name: "Electrical",
          image:
            "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1200",
        },
        {
          name: "Paint Supplies",
          image:
            "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1200",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1200",
      createdAt: new Date("2025-02-28T11:10:00Z"),
    },
    {
      name: "Baby Products",
      type: [
        {
          name: "Diapers",
          image:
            "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?q=80&w=1200",
        },
        {
          name: "Strollers",
          image:
            "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?q=80&w=1200",
        },
        {
          name: "Baby Clothing",
          image:
            "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?q=80&w=1200",
        },
        {
          name: "Toys",
          image:
            "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?q=80&w=1200",
        },
        {
          name: "Feeding",
          image:
            "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?q=80&w=1200",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?q=80&w=1200",
      createdAt: new Date("2025-02-28T11:15:00Z"),
    },
    {
      name: "Musical Instruments",
      type: [
        {
          name: "Guitars",
          image:
            "https://images.unsplash.com/photo-1541689592195-14a8c99e8de6?q=80&w=1200",
        },
        {
          name: "Keyboards",
          image:
            "https://images.unsplash.com/photo-1541689592195-14a8c99e8de6?q=80&w=1200",
        },
        {
          name: "Drums",
          image:
            "https://images.unsplash.com/photo-1541689592195-14a8c99e8de6?q=80&w=1200",
        },
        {
          name: "Microphones",
          image:
            "https://images.unsplash.com/photo-1541689592195-14a8c99e8de6?q=80&w=1200",
        },
        {
          name: "Accessories",
          image:
            "https://images.unsplash.com/photo-1541689592195-14a8c99e8de6?q=80&w=1200",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1541689592195-14a8c99e8de6?q=80&w=1200",
      createdAt: new Date("2025-02-28T11:20:00Z"),
    },
    {
      name: "Video Games",
      type: [
        {
          name: "Consoles",
          image:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
        },
        {
          name: "Games",
          image:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
        },
        {
          name: "Controllers",
          image:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
        },
        {
          name: "VR Headsets",
          image:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
        },
        {
          name: "Accessories",
          image:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
      createdAt: new Date("2025-02-28T11:25:00Z"),
    },
    {
      name: "Jewelry",
      type: [
        {
          name: "Necklaces",
          image:
            "https://images.unsplash.com/photo-1606768666853-52f0d96dae21?q=80&w=1200",
        },
        {
          name: "Rings",
          image:
            "https://images.unsplash.com/photo-1606768666853-52f0d96dae21?q=80&w=1200",
        },
        {
          name: "Earrings",
          image:
            "https://images.unsplash.com/photo-1606768666853-52f0d96dae21?q=80&w=1200",
        },
        {
          name: "Bracelets",
          image:
            "https://images.unsplash.com/photo-1606768666853-52f0d96dae21?q=80&w=1200",
        },
        {
          name: "Watches",
          image:
            "https://images.unsplash.com/photo-1606768666853-52f0d96dae21?q=80&w=1200",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1606768666853-52f0d96dae21?q=80&w=1200",
      createdAt: new Date("2025-02-28T11:30:00Z"),
    },
    {
      name: "Garden & Outdoor",
      type: [
        {
          name: "Gardening Tools",
          image:
            "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1200",
        },
        {
          name: "Outdoor Furniture",
          image:
            "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1200",
        },
        {
          name: "Grills",
          image:
            "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1200",
        },
        {
          name: "Plants",
          image:
            "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1200",
        },
        {
          name: "Patio Decor",
          image:
            "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1200",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1200",
      createdAt: new Date("2025-02-28T11:35:00Z"),
    },
    {
      name: "Arts & Crafts",
      type: [
        {
          name: "Painting Supplies",
          image:
            "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200",
        },
        {
          name: "Drawing Tools",
          image:
            "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200",
        },
        {
          name: "Sewing",
          image:
            "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200",
        },
        {
          name: "Craft Kits",
          image:
            "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200",
        },
        {
          name: "Scrapbooking",
          image:
            "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200",
      createdAt: new Date("2025-02-28T11:40:00Z"),
    },
    {
      name: "Movies & TV",
      type: [
        {
          name: "Action",
          image:
            "https://images.unsplash.com/photo-1536440136628-849c177e76ff?q=80&w=1200",
        },
        {
          name: "Drama",
          image:
            "https://images.unsplash.com/photo-1536440136628-849c177e76ff?q=80&w=1200",
        },
        {
          name: "Comedy",
          image:
            "https://images.unsplash.com/photo-1536440136628-849c177e76ff?q=80&w=1200",
        },
        {
          name: "Horror",
          image:
            "https://images.unsplash.com/photo-1536440136628-849c177e76ff?q=80&w=1200",
        },
        {
          name: "Documentaries",
          image:
            "https://images.unsplash.com/photo-1536440136628-849c177e76ff?q=80&w=1200",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1536440136628-849c177e76ff?q=80&w=1200",
      createdAt: new Date("2025-02-28T11:45:00Z"),
    },
  ]);

  // Clear existing products
  await Product.deleteMany({});
  // Insert Products
  const products = await Product.insertMany([
    // Electronics - Laptops (Category ID: "67c635eac60d2d895a8d3a23")
    {
      name: "UltraSlim Pro Laptop",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200",
      price: 1299.99,
      description: "Sleek laptop with 16GB RAM and 512GB SSD.",
      rating: 4.5,
      isDeal: true,
      category: "67c635eac60d2d895a8d3a23",
      subCategory: "Laptops",
      isAvailable: true,
      specs: {
        material: "Aluminum",
        sizes: ["13-inch"],
        colors: ["Silver"],
        care: "Wipe with cloth",
      },
      reviews: [
        {
          user: "507f191e810c19729de860ea",
          rating: 5,
          comment: "Fantastic!",
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
    },
    {
      name: "GameMaster Laptop",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200",
      price: 1599.99,
      description: "High-performance gaming laptop with RTX 3080.",
      rating: 4.8,
      isDeal: false,
      category: "67c635eac60d2d895a8d3a23",
      subCategory: "Laptops",
      isAvailable: true,
      specs: {
        material: "Plastic",
        sizes: ["15-inch"],
        colors: ["Black"],
        care: "Avoid liquids",
      },
      reviews: [],
      createdAt: new Date(),
    },
    {
      name: "WorkLite Laptop",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200",
      price: 899.99,
      description: "Lightweight laptop for professionals.",
      rating: 4.2,
      isDeal: true,
      category: "67c635eac60d2d895a8d3a23",
      subCategory: "Laptops",
      isAvailable: true,
      specs: {
        material: "Aluminum",
        sizes: ["14-inch"],
        colors: ["Gray"],
        care: "Wipe gently",
      },
      reviews: [
        {
          user: "507f191e810c19729de860eb",
          rating: 4,
          comment: "Good value.",
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
    },
    {
      name: "BudgetBook Laptop",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200",
      price: 599.99,
      description: "Affordable laptop for students.",
      rating: 3.9,
      isDeal: false,
      category: "67c635eac60d2d895a8d3a23",
      subCategory: "Laptops",
      isAvailable: true,
      specs: {
        material: "Plastic",
        sizes: ["13-inch"],
        colors: ["White"],
        care: "Keep dry",
      },
      reviews: [],
      createdAt: new Date(),
    },
    {
      name: "Creator’s Laptop",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200",
      price: 1799.99,
      description: "Powerful laptop for video editing and design.",
      rating: 4.7,
      isDeal: true,
      category: "67c635eac60d2d895a8d3a23",
      subCategory: "Laptops",
      isAvailable: true,
      specs: {
        material: "Aluminum",
        sizes: ["16-inch"],
        colors: ["Space Gray"],
        care: "Wipe with microfiber",
      },
      reviews: [
        {
          user: "507f191e810c19729de860ec",
          rating: 5,
          comment: "Perfect for creatives!",
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
    },

    // Electronics - Smartphones (Category ID: "67c635eac60d2d895a8d3a23")
    {
      name: "PixelPro Smartphone",
      image:
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=1200",
      price: 999.99,
      description: "Flagship smartphone with stunning camera.",
      rating: 4.6,
      isDeal: false,
      category: "67c635eac60d2d895a8d3a23",
      subCategory: "Smartphones",
      isAvailable: true,
      specs: {
        material: "Glass",
        sizes: ["6.5-inch"],
        colors: ["Black"],
        care: "Use case",
      },
      reviews: [],
      createdAt: new Date(),
    },
    {
      name: "GalaxyEdge Phone",
      image:
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=1200",
      price: 1099.99,
      description: "Curved-edge smartphone with OLED display.",
      rating: 4.8,
      isDeal: true,
      category: "67c635eac60d2d895a8d3a23",
      subCategory: "Smartphones",
      isAvailable: true,
      specs: {
        material: "Glass",
        sizes: ["6.7-inch"],
        colors: ["Blue"],
        care: "Avoid drops",
      },
      reviews: [
        {
          user: "507f191e810c19729de860ed",
          rating: 5,
          comment: "Love the display!",
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
    },
    {
      name: "BudgetCall Phone",
      image:
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=1200",
      price: 299.99,
      description: "Affordable smartphone with decent specs.",
      rating: 4.0,
      isDeal: false,
      category: "67c635eac60d2d895a8d3a23",
      subCategory: "Smartphones",
      isAvailable: true,
      specs: {
        material: "Plastic",
        sizes: ["6-inch"],
        colors: ["Green"],
        care: "Wipe clean",
      },
      reviews: [],
      createdAt: new Date(),
    },
    {
      name: "iSmart Phone",
      image:
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=1200",
      price: 1199.99,
      description: "Premium smartphone with fast processor.",
      rating: 4.9,
      isDeal: true,
      category: "67c635eac60d2d895a8d3a23",
      subCategory: "Smartphones",
      isAvailable: true,
      specs: {
        material: "Glass",
        sizes: ["6.1-inch"],
        colors: ["Silver"],
        care: "Use soft cloth",
      },
      reviews: [
        {
          user: "507f191e810c19729de860ee",
          rating: 5,
          comment: "Best phone ever!",
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
    },
    {
      name: "FoldTech Phone",
      image:
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=1200",
      price: 1499.99,
      description: "Innovative foldable smartphone.",
      rating: 4.5,
      isDeal: false,
      category: "67c635eac60d2d895a8d3a23",
      subCategory: "Smartphones",
      isAvailable: true,
      specs: {
        material: "Glass-Plastic",
        sizes: ["7.6-inch"],
        colors: ["Black"],
        care: "Handle with care",
      },
      reviews: [],
      createdAt: new Date(),
    },

    // Electronics - Headphones (Category ID: "67c635eac60d2d895a8d3a23")
    {
      name: "NoiseCancel Pro Headphones",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200",
      price: 199.99,
      description: "Premium noise-canceling headphones.",
      rating: 4.7,
      isDeal: true,
      category: "67c635eac60d2d895a8d3a23",
      subCategory: "Headphones",
      isAvailable: true,
      specs: {
        material: "Plastic",
        sizes: ["Over-ear"],
        colors: ["Black"],
        care: "Wipe with cloth",
      },
      reviews: [
        {
          user: "507f191e810c19729de860ef",
          rating: 5,
          comment: "Great sound!",
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
    },
    {
      name: "SportBuds Earphones",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200",
      price: 79.99,
      description: "Sweat-resistant earbuds for workouts.",
      rating: 4.3,
      isDeal: false,
      category: "67c635eac60d2d895a8d3a23",
      subCategory: "Headphones",
      isAvailable: true,
      specs: {
        material: "Silicone",
        sizes: ["In-ear"],
        colors: ["Blue"],
        care: "Clean after use",
      },
      reviews: [],
      createdAt: new Date(),
    },
    {
      name: "StudioMaster Headphones",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200",
      price: 249.99,
      description: "High-fidelity headphones for audio pros.",
      rating: 4.8,
      isDeal: true,
      category: "67c635eac60d2d895a8d3a23",
      subCategory: "Headphones",
      isAvailable: true,
      specs: {
        material: "Leather",
        sizes: ["Over-ear"],
        colors: ["Silver"],
        care: "Avoid moisture",
      },
      reviews: [],
      createdAt: new Date(),
    },
    {
      name: "BudgetBeats Earbuds",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200",
      price: 49.99,
      description: "Affordable wireless earbuds.",
      rating: 4.0,
      isDeal: false,
      category: "67c635eac60d2d895a8d3a23",
      subCategory: "Headphones",
      isAvailable: true,
      specs: {
        material: "Plastic",
        sizes: ["In-ear"],
        colors: ["White"],
        care: "Wipe gently",
      },
      reviews: [
        {
          user: "507f191e810c19729de860f0",
          rating: 4,
          comment: "Good for price.",
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
    },
    {
      name: "Gamer’s Headset",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200",
      price: 129.99,
      description: "Headset with mic for gaming.",
      rating: 4.5,
      isDeal: true,
      category: "67c635eac60d2d895a8d3a23",
      subCategory: "Headphones",
      isAvailable: true,
      specs: {
        material: "Plastic",
        sizes: ["Over-ear"],
        colors: ["Red"],
        care: "Keep dry",
      },
      reviews: [],
      createdAt: new Date(),
    },

    // Clothing - T-Shirts (Category ID: "67c635eac60d2d895a8d3a2b")
    {
      name: "Classic Cotton Tee",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200",
      price: 19.99,
      description: "Soft cotton T-shirt for everyday wear.",
      rating: 4.0,
      isDeal: false,
      category: "67c635eac60d2d895a8d3a2b",
      subCategory: "T-Shirts",
      isAvailable: true,
      specs: {
        material: "Cotton",
        sizes: ["S", "M", "L"],
        colors: ["White"],
        care: "Machine wash",
      },
      reviews: [],
      createdAt: new Date(),
    },
    {
      name: "Graphic Print Tee",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200",
      price: 24.99,
      description: "Stylish T-shirt with unique graphic design.",
      rating: 4.3,
      isDeal: true,
      category: "67c635eac60d2d895a8d3a2b",
      subCategory: "T-Shirts",
      isAvailable: true,
      specs: {
        material: "Cotton-Poly",
        sizes: ["M", "L"],
        colors: ["Black"],
        care: "Wash inside out",
      },
      reviews: [
        {
          user: "507f191e810c19729de860f1",
          rating: 4,
          comment: "Cool design!",
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
    },
    {
      name: "V-Neck Basic Tee",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200",
      price: 17.99,
      description: "Comfortable V-neck T-shirt.",
      rating: 3.8,
      isDeal: false,
      category: "67c635eac60d2d895a8d3a2b",
      subCategory: "T-Shirts",
      isAvailable: true,
      specs: {
        material: "Cotton",
        sizes: ["S", "XL"],
        colors: ["Gray"],
        care: "Machine wash",
      },
      reviews: [],
      createdAt: new Date(),
    },
    {
      name: "Sports Tee",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200",
      price: 22.99,
      description: "Breathable T-shirt for active use.",
      rating: 4.5,
      isDeal: true,
      category: "67c635eac60d2d895a8d3a2b",
      subCategory: "T-Shirts",
      isAvailable: true,
      specs: {
        material: "Polyester",
        sizes: ["M", "L"],
        colors: ["Blue"],
        care: "Wash cold",
      },
      reviews: [],
      createdAt: new Date(),
    },
    {
      name: "Long-Sleeve Tee",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200",
      price: 29.99,
      description: "Cozy long-sleeve T-shirt.",
      rating: 4.1,
      isDeal: false,
      category: "67c635eac60d2d895a8d3a2b",
      subCategory: "T-Shirts",
      isAvailable: true,
      specs: {
        material: "Cotton",
        sizes: ["L", "XL"],
        colors: ["Navy"],
        care: "Dry low",
      },
      reviews: [
        {
          user: "507f191e810c19729de860f2",
          rating: 4,
          comment: "Very comfy.",
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
    },

    // Clothing - Jeans (Category ID: "67c635eac60d2d895a8d3a2b")
    {
      name: "Slim Fit Jeans",
      image:
        "https://images.unsplash.com/photo-1542272604-787c03361a5f?q=80&w=1200",
      price: 49.99,
      description: "Stylish slim-fit denim jeans.",
      rating: 4.4,
      isDeal: true,
      category: "67c635eac60d2d895a8d3a2b",
      subCategory: "Jeans",
      isAvailable: true,
      specs: {
        material: "Denim",
        sizes: ["30", "32", "34"],
        colors: ["Blue"],
        care: "Machine wash",
      },
      reviews: [],
      createdAt: new Date(),
    },
    {
      name: "Rugged Work Jeans",
      image:
        "https://images.unsplash.com/photo-1542272604-787c03361a5f?q=80&w=1200",
      price: 59.99,
      description: "Durable jeans for tough jobs.",
      rating: 4.6,
      isDeal: false,
      category: "67c635eac60d2d895a8d3a2b",
      subCategory: "Jeans",
      isAvailable: true,
      specs: {
        material: "Denim",
        sizes: ["32", "36"],
        colors: ["Black"],
        care: "Wash cold",
      },
      reviews: [
        {
          user: "507f191e810c19729de860f3",
          rating: 5,
          comment: "Super tough!",
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
    },
    {
      name: "High-Waist Jeans",
      image:
        "https://images.unsplash.com/photo-1542272604-787c03361a5f?q=80&w=1200",
      price: 54.99,
      description: "Trendy high-waisted jeans.",
      rating: 4.3,
      isDeal: true,
      category: "67c635eac60d2d895a8d3a2b",
      subCategory: "Jeans",
      isAvailable: true,
      specs: {
        material: "Denim",
        sizes: ["28", "30"],
        colors: ["Light Blue"],
        care: "Dry low",
      },
      reviews: [],
      createdAt: new Date(),
    },
    {
      name: "Bootcut Jeans",
      image:
        "https://images.unsplash.com/photo-1542272604-787c03361a5f?q=80&w=1200",
      price: 44.99,
      description: "Classic bootcut jeans.",
      rating: 4.1,
      isDeal: false,
      category: "67c635eac60d2d895a8d3a2b",
      subCategory: "Jeans",
      isAvailable: true,
      specs: {
        material: "Denim",
        sizes: ["32", "34"],
        colors: ["Dark Blue"],
        care: "Machine wash",
      },
      reviews: [],
      createdAt: new Date(),
    },
    {
      name: "Stretch Jeans",
      image:
        "https://images.unsplash.com/photo-1542272604-787c03361a5f?q=80&w=1200",
      price: 52.99,
      description: "Comfortable stretch denim jeans.",
      rating: 4.5,
      isDeal: true,
      category: "67c635eac60d2d895a8d3a2b",
      subCategory: "Jeans",
      isAvailable: true,
      specs: {
        material: "Denim-Spandex",
        sizes: ["30", "32"],
        colors: ["Gray"],
        care: "Wash gently",
      },
      reviews: [
        {
          user: "507f191e810c19729de860f4",
          rating: 4,
          comment: "Very flexible!",
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
    },

    // Books - Fiction (Category ID: "67c635eac60d2d895a8d3a33")
    {
      name: "The Lost Chronicles",
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1200",
      price: 14.99,
      description: "A thrilling fantasy novel.",
      rating: 4.8,
      isDeal: true,
      category: "67c635eac60d2d895a8d3a33",
      subCategory: "Fiction",
      isAvailable: true,
      specs: {
        material: "Paperback",
        sizes: ["Standard"],
        colors: ["Multicolor"],
        care: "Keep dry",
      },
      reviews: [
        {
          user: "507f191e810c19729de860f5",
          rating: 5,
          comment: "Epic story!",
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
    },
    {
      name: "Shadows of Time",
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1200",
      price: 12.99,
      description: "Mystery fiction with a twist.",
      rating: 4.4,
      isDeal: false,
      category: "67c635eac60d2d895a8d3a33",
      subCategory: "Fiction",
      isAvailable: true,
      specs: {
        material: "Hardcover",
        sizes: ["Standard"],
        colors: ["Black"],
        care: "Dust gently",
      },
      reviews: [],
      createdAt: new Date(),
    },
    {
      name: "Dragon’s Legacy",
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1200",
      price: 16.99,
      description: "Epic tale of dragons and knights.",
      rating: 4.7,
      isDeal: true,
      category: "67c635eac60d2d895a8d3a33",
      subCategory: "Fiction",
      isAvailable: true,
      specs: {
        material: "Paperback",
        sizes: ["Standard"],
        colors: ["Red"],
        care: "Avoid water",
      },
      reviews: [],
      createdAt: new Date(),
    },
    {
      name: "Whispers in the Dark",
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1200",
      price: 13.99,
      description: "Haunting fiction thriller.",
      rating: 4.5,
      isDeal: false,
      category: "67c635eac60d2d895a8d3a33",
      subCategory: "Fiction",
      isAvailable: true,
      specs: {
        material: "Paperback",
        sizes: ["Standard"],
        colors: ["Gray"],
        care: "Store upright",
      },
      reviews: [
        {
          user: "507f191e810c19729de860f6",
          rating: 4,
          comment: "Spooky!",
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
    },
    {
      name: "Starborn Quest",
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1200",
      price: 15.99,
      description: "Sci-fi adventure novel.",
      rating: 4.6,
      isDeal: true,
      category: "67c635eac60d2d895a8d3a33",
      subCategory: "Fiction",
      isAvailable: true,
      specs: {
        material: "Hardcover",
        sizes: ["Standard"],
        colors: ["Blue"],
        care: "Keep dry",
      },
      reviews: [],
      createdAt: new Date(),
    },

    // Toys & Games - Board Games (Category ID: "67c635eac60d2d895a8d3a3a")
    {
      name: "Family Strategy Game",
      image:
        "https://images.unsplash.com/photo-1517673132400-3e7d9a29b813?q=80&w=1200",
      price: 29.99,
      description: "Fun board game for all ages.",
      rating: 4.2,
      isDeal: false,
      category: "67c635eac60d2d895a8d3a3a",
      subCategory: "Board Games",
      isAvailable: true,
      specs: {
        material: "Cardboard",
        sizes: ["Standard"],
        colors: ["Multicolor"],
        care: "Store flat",
      },
      reviews: [],
      createdAt: new Date(),
    },
    {
      name: "Mystery Manor",
      image:
        "https://images.unsplash.com/photo-1517673132400-3e7d9a29b813?q=80&w=1200",
      price: 34.99,
      description: "Solve the mystery in this board game.",
      rating: 4.5,
      isDeal: true,
      category: "67c635eac60d2d895a8d3a3a",
      subCategory: "Board Games",
      isAvailable: true,
      specs: {
        material: "Cardboard",
        sizes: ["Standard"],
        colors: ["Black"],
        care: "Keep dry",
      },
      reviews: [
        {
          user: "507f191e810c19729de860f7",
          rating: 5,
          comment: "Super fun!",
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
    },
    {
      name: "Kingdom Quest",
      image:
        "https://images.unsplash.com/photo-1517673132400-3e7d9a29b813?q=80&w=1200",
      price: 39.99,
      description: "Adventure-themed board game.",
      rating: 4.6,
      isDeal: false,
      category: "67c635eac60d2d895a8d3a3a",
      subCategory: "Board Games",
      isAvailable: true,
      specs: {
        material: "Plastic",
        sizes: ["Standard"],
        colors: ["Green"],
        care: "Wipe pieces",
      },
      reviews: [],
      createdAt: new Date(),
    },
    {
      name: "Trivia Challenge",
      image:
        "https://images.unsplash.com/photo-1517673132400-3e7d9a29b813?q=80&w=1200",
      price: 24.99,
      description: "Test your knowledge with this game.",
      rating: 4.0,
      isDeal: true,
      category: "67c635eac60d2d895a8d3a3a",
      subCategory: "Board Games",
      isAvailable: true,
      specs: {
        material: "Cardboard",
        sizes: ["Standard"],
        colors: ["Blue"],
        care: "Store in box",
      },
      reviews: [],
      createdAt: new Date(),
    },
    {
      name: "Space Race",
      image:
        "https://images.unsplash.com/photo-1517673132400-3e7d9a29b813?q=80&w=1200",
      price: 32.99,
      description: "Race to the stars in this board game.",
      rating: 4.4,
      isDeal: false,
      category: "67c635eac60d2d895a8d3a3a",
      subCategory: "Board Games",
      isAvailable: true,
      specs: {
        material: "Cardboard",
        sizes: ["Standard"],
        colors: ["Silver"],
        care: "Avoid moisture",
      },
      reviews: [
        {
          user: "507f191e810c19729de860f8",
          rating: 4,
          comment: "Kids love it!",
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
    },

    // Home & Kitchen - Cookware (Category ID: "67c635eac60d2d895a8d3a41")
    {
      name: "Non-Stick Fry Pan",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
      price: 49.99,
      description: "Durable non-stick frying pan.",
      rating: 4.7,
      isDeal: true,
      category: "67c635eac60d2d895a8d3a41",
      subCategory: "Cookware",
      isAvailable: true,
      specs: {
        material: "Aluminum",
        sizes: ["10-inch"],
        colors: ["Black"],
        care: "Hand wash",
      },
      reviews: [],
      createdAt: new Date(),
    },
    {
      name: "Cast Iron Skillet",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
      price: 59.99,
      description: "Heavy-duty cast iron skillet.",
      rating: 4.8,
      isDeal: false,
      category: "67c635eac60d2d895a8d3a41",
      subCategory: "Cookware",
      isAvailable: true,
      specs: {
        material: "Cast Iron",
        sizes: ["12-inch"],
        colors: ["Black"],
        care: "Season regularly",
      },
      reviews: [
        {
          user: "507f191e810c19729de860f9",
          rating: 5,
          comment: "Perfect sear!",
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
    },
    {
      name: "Saucepan Set",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
      price: 79.99,
      description: "3-piece saucepan set with lids.",
      rating: 4.5,
      isDeal: true,
      category: "67c635eac60d2d895a8d3a41",
      subCategory: "Cookware",
      isAvailable: true,
      specs: {
        material: "Stainless Steel",
        sizes: ["1qt", "2qt"],
        colors: ["Silver"],
        care: "Dishwasher safe",
      },
      reviews: [],
      createdAt: new Date(),
    },
    {
      name: "Ceramic Pot",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
      price: 69.99,
      description: "Non-toxic ceramic cooking pot.",
      rating: 4.6,
      isDeal: false,
      category: "67c635eac60d2d895a8d3a41",
      subCategory: "Cookware",
      isAvailable: true,
      specs: {
        material: "Ceramic",
        sizes: ["3qt"],
        colors: ["White"],
        care: "Hand wash",
      },
      reviews: [],
      createdAt: new Date(),
    },
    {
      name: "Wok Pan",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
      price: 54.99,
      description: "Versatile wok for stir-frying.",
      rating: 4.4,
      isDeal: true,
      category: "67c635eac60d2d895a8d3a41",
      subCategory: "Cookware",
      isAvailable: true,
      specs: {
        material: "Carbon Steel",
        sizes: ["14-inch"],
        colors: ["Black"],
        care: "Season after use",
      },
      reviews: [
        {
          user: "507f191e810c19729de860fa",
          rating: 4,
          comment: "Great wok!",
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
    },

    // Home & Kitchen - Furniture (Category ID: "67c635eac60d2d895a8d3a41")
    {
      name: "Modern Sofa",
      image:
        "https://images.unsplash.com/photo-1550581190-9e5f7f1f1e5b?q=80&w=1200",
      price: 499.99,
      description: "Comfortable modern sofa for living rooms.",
      rating: 4.6,
      isDeal: true,
      category: "67c635eac60d2d895a8d3a41",
      subCategory: "Furniture",
      isAvailable: true,
      specs: {
        material: "Fabric",
        sizes: ["3-seater"],
        colors: ["Gray"],
        care: "Vacuum clean",
      },
      reviews: [],
      createdAt: new Date(),
    },
    {
      name: "Wooden Dining Table",
      image:
        "https://images.unsplash.com/photo-1550581190-9e5f7f1f1e5b?q=80&w=1200",
      price: 399.99,
      description: "Solid wood table for family dinners.",
      rating: 4.7,
      isDeal: false,
      category: "67c635eac60d2d895a8d3a41",
      subCategory: "Furniture",
      isAvailable: true,
      specs: {
        material: "Oak",
        sizes: ["6-seater"],
        colors: ["Brown"],
        care: "Polish monthly",
      },
      reviews: [
        {
          user: "507f191e810c19729de860fb",
          rating: 5,
          comment: "Sturdy!",
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
    },
    {
      name: "Ergonomic Office Chair",
      image:
        "https://images.unsplash.com/photo-1550581190-9e5f7f1f1e5b?q=80&w=1200",
      price: 199.99,
      description: "Adjustable chair for long work hours.",
      rating: 4.5,
      isDeal: true,
      category: "67c635eac60d2d895a8d3a41",
      subCategory: "Furniture",
      isAvailable: true,
      specs: {
        material: "Mesh",
        sizes: ["Standard"],
        colors: ["Black"],
        care: "Wipe with damp cloth",
      },
      reviews: [],
      createdAt: new Date(),
    },
    {
      name: "Bookshelf Unit",
      image:
        "https://images.unsplash.com/photo-1550581190-9e5f7f1f1e5b?q=80&w=1200",
      price: 149.99,
      description: "Tall bookshelf for storage.",
      rating: 4.3,
      isDeal: false,
      category: "67c635eac60d2d895a8d3a41",
      subCategory: "Furniture",
      isAvailable: true,
      specs: {
        material: "Particle Board",
        sizes: ["5-shelf"],
        colors: ["White"],
        care: "Dust regularly",
      },
      reviews: [],
      createdAt: new Date(),
    },
    {
      name: "Leather Recliner",
      image:
        "https://images.unsplash.com/photo-1550581190-9e5f7f1f1e5b?q=80&w=1200",
      price: 599.99,
      description: "Luxurious leather recliner chair.",
      rating: 4.8,
      isDeal: true,
      category: "67c635eac60d2d895a8d3a41",
      subCategory: "Furniture",
      isAvailable: true,
      specs: {
        material: "Leather",
        sizes: ["Single"],
        colors: ["Brown"],
        care: "Condition leather",
      },
      reviews: [
        {
          user: "507f191e810c19729de860fc",
          rating: 5,
          comment: "So comfy!",
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
    },
  ]);
  // Insert Carts
  // await Cart.insertMany([
  //   {
  //     user: users[0]._id,
  //     items: [
  //       {
  //         product: products[0]._id,
  //         quantity: 1,
  //         color: "Silver",
  //         size: "15-inch",
  //         addedAt: new Date("2025-02-28T15:00:00Z"),
  //       },
  //       {
  //         product: products[4]._id,
  //         quantity: 2,
  //         color: "Black",
  //         size: "M",
  //         addedAt: new Date("2025-02-28T15:05:00Z"),
  //       },
  //     ],
  //     createdAt: new Date("2025-02-28T15:00:00Z"),
  //   },
  // ]);

  // Insert Orders
  // await Order.insertMany([
  //   {
  //     user: users[0]._id,
  //     totalAmount: 1109.97,
  //     status: "shipped",
  //     items: [
  //       {
  //         product: products[0]._id,
  //         quantity: 1,
  //         price: 999.99,
  //         color: "Silver",
  //         size: "15-inch",
  //       },
  //       {
  //         product: products[4]._id,
  //         quantity: 2,
  //         price: 19.99,
  //         color: "Black",
  //         size: "M",
  //       },
  //     ],
  //     createdAt: new Date("2025-02-28T16:00:00Z"),
  //     updatedAt: new Date("2025-03-01T09:00:00Z"),
  //   },
  // ]);

  console.log("Database seeded successfully");
  process.exit(0);
};

seedData().catch(console.error);
