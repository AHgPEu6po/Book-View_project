import sessionListModel from "../models/sessionListModel.js";
import cinemaModel from "../models/cinemaModel.js";
import filmModel from "../models/filmModel.js";
import logger from "../config/logger.js";

const createSessionList = async (req, res) => {
  try {
    const { cinema_id, film_id } = req.body;

    if (!cinema_id || !film_id) {
      return res.json({ success: false, message: "Missing data" });
    }

    const cinema = await cinemaModel.findById(cinema_id);
    const film = await filmModel.findById(film_id);

    if (!cinema || !film) {
      return res.json({ success: false, message: "Cinema or Film not found" });
    }

    const sessionList = await sessionListModel.create({ cinema_id, film_id, list: [] });

    cinema.lists.push(sessionList._id);
    film.lists.push(sessionList._id);

    await cinema.save();
    await film.save();

    res.json({ success: true, sessionList });

  } catch (error) {
    logger.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

const deleteSessionList = async (req, res) => {
  try {
    const { sessionListId } = req.body;

    const sessionList = await sessionListModel.findById(sessionListId);

    if (!sessionList) {
      return res.json({ success: false, message: "SessionList not found" });
    }

    await cinemaModel.findByIdAndUpdate(sessionList.cinema_id, {
      $pull: { lists: sessionListId }
    });

    await filmModel.findByIdAndUpdate(sessionList.film_id, {
      $pull: { lists: sessionListId }
    });

    await sessionListModel.findByIdAndDelete(sessionListId);

    res.json({ success: true, message: "Deleted" });

  } catch (error) {
    logger.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

const getSessionListData = async (req, res) => {
  try {
    const { sessionListId } = req.body;

    const list = await sessionListModel
      .findById(sessionListId)
      .populate("cinema_id")
      .populate("film_id")
      .populate("list");

    if (!list) {
      return res.json({ success: false, message: "Not found" });
    }

    res.json({ success: true, list });

  } catch (error) {
    logger.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export { createSessionList, deleteSessionList, getSessionListData };