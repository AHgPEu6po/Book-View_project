import filmModel from "../models/filmModel.js";
import logger from "../config/logger.js";
import { v2 as cloudinary } from "cloudinary"

const createFilm = async (req, res) => {
  try {
    const { name, ageRating, category, trailerURL } = req.body;

    const imageFile = req.file;

    if (!name || !imageFile || !ageRating || !category) {
      return res.json({
        success: false,
        message: "Missing required fields"
      });
    }

    const result = await cloudinary.uploader.upload(
      imageFile.path,
      { resource_type: "image" }
    );

    const film = new filmModel({ name, image: result.secure_url, ageRating, category, trailerURL });

    const savedFilm = await film.save();

    res.json({
      success: true,
      film: savedFilm
    });

  } catch (error) {
    logger.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

const changePremierStatus = async (req, res) => {
  try {
    const { filmId, isPremiere } = req.body;

    const film = await filmModel.findByIdAndUpdate(
      filmId,
      { isPremiere },
      { new: true }
    );

    if (!film) {
      return res.json({ success: false, message: "Film not found" });
    }

    res.json({
      success: true,
      isPremiere: film.isPremiere
    });

  } catch (error) {
    logger.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

const listAllFilms = async (req, res) => {
  try {
    const films = await filmModel.find();

    res.json({ success: true, films });

  } catch (error) {
    logger.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

const getFilmData = async (req, res) => {
  try {
    const { filmId } = req.body;

    const film = await filmModel.findById(filmId);

    if (!film) {
      return res.json({
        success: false,
        message: "Film not found"
      });
    }

    res.json({ success: true, film });

  } catch (error) {
    logger.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

const listEnableFilms = async (req, res) => {
  try {
    const films = await filmModel.find({
      lists: { $exists: true, $ne: [] }
    });

    res.json({ success: true, films });

  } catch (error) {
    logger.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export { createFilm, changePremierStatus, listAllFilms, getFilmData, listEnableFilms };