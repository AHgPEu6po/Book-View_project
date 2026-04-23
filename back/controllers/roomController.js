import roomModel from "../models/roomModel.js";
import cinemaModel from "../models/cinemaModel.js";
import logger from "../config/logger.js";

const createRoom = async (req, res) => {
  try {
    const { cinema_id, name, rows } = req.body;

    if (!cinema_id || !name || !rows) {
      return res.json({
        success: false,
        message: "Missing required fields"
      });
    }

    const cinema = await cinemaModel.findById(cinema_id);

    if (!cinema) {
      return res.json({
        success: false,
        message: "Cinema not found"
      });
    }

    const room = await roomModel.create({
      cinema_id,
      name,
      rows
    });

    cinema.rooms.push(room._id);
    await cinema.save();

    res.json({
      success: true,
      room
    });

  } catch (error) {
    logger.error(error.message);
    res.json({
      success: false,
      message: error.message
    });
  }
};

const getRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    const room = await roomModel.findById(roomId);

    if (!room) {
      return res.json({
        success: false,
        message: "Room not found"
      });
    }

    res.json({
      success: true,
      room
    });

  } catch (error) {
    logger.error(error.message);
    res.json({
      success: false,
      message: error.message
    });
  }
};


export { createRoom, getRoom };