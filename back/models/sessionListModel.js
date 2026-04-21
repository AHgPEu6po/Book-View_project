import mongoose from "mongoose";

const sessionListSchema = new mongoose.Schema({

})

const sessionListModel = mongoose.models.sessionList || mongoose.model("sessionList", sessionListSchema);

export default sessionListModel