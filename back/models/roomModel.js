import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({

})

const roomModel = mongoose.models.room || mongoose.model("room", roomSchema);

export default roomModel