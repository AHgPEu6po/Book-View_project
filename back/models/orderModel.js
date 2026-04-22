import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  film_id: { type: mongoose.Schema.Types.ObjectId, ref: "film", required: true },
  session_id: { type: mongoose.Schema.Types.ObjectId, ref: "session", required: true },
  seats: [
    {
      row: Number,
      number: Number,
      price: Number,
    }
  ],
  totalPrice: Number,
  status: {
    type: String,
    enum: ["pending", "paid", "cancelled"],
    default: "pending",
  },
}, { timestamps: true });

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel