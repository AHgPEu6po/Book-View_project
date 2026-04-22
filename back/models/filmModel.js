import mongoose from "mongoose";

const filmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  ageRating: { type: String, required: true },
  category: [{ type: String, required: true }],
  trailerURL: { type: String },
  isPremiere: { type: Boolean, default: false },
  lists: [{ type: mongoose.Schema.Types.ObjectId, ref: "sessionList" }],
}, { timestamps: true })

const filmModel = mongoose.models.film || mongoose.model("film", filmSchema);

export default filmModel