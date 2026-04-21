import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({

})

const sessionModel = mongoose.models.session || mongoose.model("session", sessionSchema);

export default sessionModel