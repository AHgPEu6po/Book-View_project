import express from "express";
import { createFilm, changePremierStatus, listAllFilms, getFilmData, listEnableFilms } from "../controllers/filmController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const filmRouter = express.Router();

filmRouter.post("/create", adminAuth, upload.single("image"), createFilm);
filmRouter.post("/premiere", adminAuth, changePremierStatus);
filmRouter.get("/all", listAllFilms);
filmRouter.get("/available", listEnableFilms);
filmRouter.post("/single", getFilmData);

export default filmRouter;