import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: Number,
  qty: Number,
  image: String,
});

const orderSchema = new mongoose.Schema(
  {
    items: [orderItemSchema],
    shipping: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: String, required: true },
    },
    total: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    userEmail: { type: String, default: null }, // optional, set if a logged-in user checks out
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
