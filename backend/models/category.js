const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String, // Correct type: String, not a number like 1
    required: true,
    unique: true,
    trim: true, // Removes whitespace for cleaner data
  },
  type: [
    {
      name: {
        type: String, // Correct type: String
        required: true,
        trim: true, // Ensures clean type names (e.g., "Laptop")
      },
      image: {
        type: String, // Correct type: String for URL
        default:
          "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081", // Optional image URL for the type (e.g., Laptop)
      },
    },
  ],
  image: {
    type: String, // Correct type: String for URL
    default:
      "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081", // Optional image URL for the category (e.g., Electronics)
  },
  createdAt: {
    type: Date, // Correct type: Date
    default: Date.now,
    immutable: true, // Prevents updates to createdAt
  },
});

module.exports = mongoose.model("Category", categorySchema);
