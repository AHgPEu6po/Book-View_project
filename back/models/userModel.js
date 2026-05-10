import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
    film_id: { type: mongoose.Schema.Types.ObjectId, ref: "film" },
    sessionDate: { type: Date }, 
    rating: { type: Number, default: null }
  }, { _id: false } );

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
  history: [historySchema],
}, { timestamps: true });


const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel