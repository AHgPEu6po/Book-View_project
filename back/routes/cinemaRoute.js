import expres from 'express'
import { createCinema, listAllCinemas, getCinemaData, listNamesOfCinemas } from '../controllers/cinemaController.js'
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const cinemaRouter = expres.Router()

cinemaRouter.post("/create", adminAuth, upload.single("image"), createCinema);
cinemaRouter.get("/all", listAllCinemas);
cinemaRouter.get("/names", listNamesOfCinemas);
cinemaRouter.post("/single", getCinemaData);

export default cinemaRouter