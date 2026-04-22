import cinemaModel from "../models/cinemaModel.js";
import logger from "../config/logger.js";
import { v2 as cloudinary } from "cloudinary";

const createCinema = async (req, res) => {
  try {
    const { name, address, city, district, cinemaURL } = req.body;

    const imageFile = req.file;

    if (!name || !address || !city || !district || !imageFile) {
      return res.json({
        success: false,
        message: "Missing required fields"
      });
    }

    const result = await cloudinary.uploader.upload(
      imageFile.path,
      { resource_type: "image" }
    );

    const cinema = new cinemaModel({ name, image: result.secure_url, address, city, district, cinemaURL });

    const savedCinema = await cinema.save();

    res.json({ success: true, cinema: savedCinema});

  } catch (error) {
    logger.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

const listAllCinemas = async (req, res) => {
  try {
    const cinemas = await cinemaModel.find();

    res.json({ success: true, cinemas});

  } catch (error) {
    logger.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

const getCinemaData = async (req, res) => {
  try {
    const { cinemaId } = req.body;

    const cinema = await cinemaModel.findById(cinemaId);

    if (!cinema) {
      return res.json({ success: false, message: "Cinema not found"});
    }

    res.json({ success: true, cinema });

  } catch (error) {
    logger.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

const listNamesOfCinemas = async (req, res) => {
  try {
    const cinemas = await cinemaModel.find().select("name");

    const names = cinemas.map(c => c.name);

    res.json({ success: true, names });

  } catch (error) {
    logger.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export { createCinema, listAllCinemas, getCinemaData, listNamesOfCinemas};