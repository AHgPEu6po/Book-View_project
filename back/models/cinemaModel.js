import mongoose from "mongoose";

const cinemaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  cinemaURL: { type: String },
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "room" }],
  lists: [{ type: mongoose.Schema.Types.ObjectId, ref: "sessionList" }],
}, { timestamps: true });

const cinemaModel = mongoose.models.cinema || mongoose.model("cinema", cinemaSchema);

export default cinemaModel