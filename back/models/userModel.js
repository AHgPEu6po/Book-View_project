import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Object, default: {}},
  birthYear: Number,
  favoriteGenres: [{ type: String }],
  excludedGenres: [{ type: String }],
  city: String,
  district: String,
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: "order" }],
}, { timestamps: true });


const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel