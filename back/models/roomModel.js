import mongoose from "mongoose";

const seatInRowSchema = new mongoose.Schema({
  number: Number,
  type: { type: String, enum: ["standard", "empty"] },
}, { _id: false });

const rowSchema = new mongoose.Schema({
  rowNumber: Number,
  offset: Number,
  seats: [seatInRowSchema],
}, { _id: false });

const roomSchema = new mongoose.Schema({
  cinema_id: { type: mongoose.Schema.Types.ObjectId, ref: "cinema", required: true },
  name: { type: String, required: true },
  rows: [rowSchema],
}, { timestamps: true });

const roomModel = mongoose.models.room || mongoose.model("room", roomSchema);

export default roomModel