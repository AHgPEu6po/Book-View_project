import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  row: Number,
  number: Number,
  isAvailable: Boolean,
  price: Number,
}, { _id: false });

const sessionSchema = new mongoose.Schema({
  list_id: { type: mongoose.Schema.Types.ObjectId, ref: "sessionList", required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  format: { type: String },
  room_id: { type: String, ref: "room", required: true },
  seats: [seatSchema],
}, { timestamps: true });

const sessionModel = mongoose.models.session || mongoose.model("session", sessionSchema);

export default sessionModel