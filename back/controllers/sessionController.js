import sessionModel from "../models/sessionModel.js";
import roomModel from "../models/roomModel.js";
import sessionListModel from "../models/sessionListModel.js";
import logger from "../config/logger.js";

const generateSeats = (room) => {
  const result = [];

  room.rows.forEach((row, rowIndex) => {
    row.seats.forEach((seat, seatIndex) => {
      if (seat.type === "empty") return;

      let basePrice = 120;

      if (rowIndex > 10) basePrice += 40;
      else if (rowIndex > 5) basePrice += 20;

      const center = row.seats.length / 2;
      if (Math.abs(seatIndex - center) < 3) basePrice += 30;

      const isAvailable = true;

      result.push({
        row: row.rowNumber,
        number: seat.number,
        isAvailable,
        price: basePrice,
      });
    });
  });

  return result;
};

const createSession = async (req, res) => {
  try {
    const { list_id, date, time, format, room_id } = req.body;

    if (!list_id || !date || !time || !format || !room_id) {
      return res.json({ success: false, message: "Missing data" });
    }

    const room = await roomModel.findById(room_id);

    if (!room) {
      return res.json({ success: false, message: "Room not found" });
    }

    const seats = generateSeats(room);

    const session = await sessionModel.create({
      list_id,
      date,
      time,
      format,
      room_id,
      seats
    });

    await sessionListModel.findByIdAndUpdate(list_id, {
      $addToSet: { list: session._id }
    });

    res.json({
      success: true,
      session
    });

  } catch (error) {
    logger.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

const deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await sessionModel.findById(sessionId);

    if (!session) {
      return res.json({ success: false, message: "Session not found" });
    }

    await sessionListModel.findByIdAndUpdate(session.list_id, {
      $pull: { list: sessionId }
    });

    await sessionModel.findByIdAndDelete(sessionId);

    res.json({ success: true, message: "Deleted" });

  } catch (error) {
    logger.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

const getSessionData = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await sessionModel
      .findById(sessionId)
      .populate("room_id");

    if (!session) {
      return res.json({ success: false, message: "Session not found" });
    }

    res.json({
      success: true,
      session
    });

  } catch (error) {
    logger.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

const updateSeats = async (req, res) => {
  try {
    const { sessionId, seats } = req.body;
    // seats = [{ row, number }]

    const session = await sessionModel.findById(sessionId);

    if (!session) {
      return res.json({ success: false, message: "Session not found" });
    }

    for (const seat of seats) {
      const found = session.seats.find(
        s => s.row === seat.row && s.number === seat.number
      );

      if (!found || !found.isAvailable) {
        return res.json({
          success: false,
          message: `Seat ${seat.row}-${seat.number} not available`
        });
      }
    }

    session.seats = session.seats.map(s => {
      const match = seats.find(
        seat => seat.row === s.row && seat.number === s.number
      );

      if (match) {
        return { ...s.toObject(), isAvailable: false };
      }

      return s;
    });

    await session.save();

    res.json({ success: true });

  } catch (error) {
    logger.error(error.message);
    res.json({ success: false, message: error.message });
  }
};


export { createSession, deleteSession, getSessionData, updateSeats };