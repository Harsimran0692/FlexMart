const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  color: { type: String },
  size: { type: String },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "shipped", "delivered", "cancelled"],
  },
  address: {
    id: String, // Changed from Number to String to match MongoDB _id
    name: String,
    address: String,
    phone: String,
    email: String,
  },
  paymentDetails: {
    cardNumberLast4: String,
    cardholderName: String,
  },
  items: [orderItemSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
