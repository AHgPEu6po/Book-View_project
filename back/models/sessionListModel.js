import mongoose from "mongoose";

const sessionListSchema = new mongoose.Schema({
  cinema_id: { type: mongoose.Schema.Types.ObjectId, ref: "cinema", required: true },
  film_id: { type: mongoose.Schema.Types.ObjectId, ref: "film", required: true },
  list: [{ type: mongoose.Schema.Types.ObjectId, ref: "session" }],
}, { timestamps: true });

const sessionListModel = mongoose.models.sessionList || mongoose.model("sessionList", sessionListSchema);

export default sessionListModel