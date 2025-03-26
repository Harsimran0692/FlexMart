const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    type: Number,
    required: true, // Snapshot of price at time of addition
  },
  discount: {
    type: Number,
    default: 0, // Discount applied to this item, if any
  },
  name: {
    type: String,
    required: true, // Snapshot of product name
  },
  availability: {
    type: String,
    enum: ["In Stock", "Out of Stock"],
    default: "In Stock",
  },
  color: {
    type: String,
  },
  size: {
    type: String,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Optional for guest carts
    },
    sessionId: {
      type: String, // For anonymous/guest users
    },
    items: [cartItemSchema], // Embedded cart items
    status: {
      type: String,
      enum: ["active", "abandoned", "ordered"],
      default: "active",
    },
    total: {
      type: Number,
      default: 0, // Calculated total (optional, for caching)
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true }, // Include virtuals in JSON output
  }
);

// Ensure a cart is unique per user or session
cartSchema.index({ user: 1 }, { unique: true, sparse: true }); // Unique for logged-in users
cartSchema.index({ sessionId: 1 }, { unique: true, sparse: true }); // Unique for guests

// Virtual to calculate subtotal dynamically
cartSchema.virtual("subtotal").get(function () {
  return this.items.reduce((sum, item) => {
    return sum + (item.price - item.discount) * item.quantity;
  }, 0);
});
cartSchema.virtual("totalItems").get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Pre-save hook to update lastModified and total (optional)
cartSchema.pre("save", function (next) {
  this.lastModified = Date.now();
  this.total = this.subtotal; // Cache the total (optional)
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
