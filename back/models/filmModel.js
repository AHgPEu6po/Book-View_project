import mongoose from "mongoose";

const filmSchema = new mongoose.Schema({

})

const filmModel = mongoose.models.film || mongoose.model("film", filmSchema);

export default filmModel