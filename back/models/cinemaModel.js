import mongoose from "mongoose";

const cinemaSchema = new mongoose.Schema({

})

const cinemaModel = mongoose.models.cinema || mongoose.model("cinema", cinemaSchema);

export default cinemaModel