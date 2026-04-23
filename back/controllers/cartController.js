import logger from "../config/logger.js";
import userModel from "../models/userModel.js";

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId, seat } = req.body;

    const user = await userModel.findById(userId);

    let cartData = user.cartData || {};

    if (!cartData[sessionId]) {
      cartData[sessionId] = [];
    }

    const exists = cartData[sessionId].some(
      s => s.row === seat.row && s.number === seat.number
    );

    if (!exists) {
      cartData[sessionId].push(seat);
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, cartData });

  } catch (error) {
    logger.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

const deleteFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId, seat } = req.body;

    const user = await userModel.findById(userId);

    let cartData = user.cartData || {};

    if (!cartData[sessionId]) {
      return res.json({ success: true, cartData });
    }

    cartData[sessionId] = cartData[sessionId].filter(
      s => !(s.row === seat.row && s.number === seat.number)
    );

    if (cartData[sessionId].length === 0) {
      delete cartData[sessionId];
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, cartData });

  } catch (error) {
    logger.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId);

    res.json({
      success: true,
      cartData: user.cartData || {}
    });

  } catch (error) {
    logger.error(error.message);
    res.json({ success: false, message: error.message });
  }
};


export { addToCart, deleteFromCart, getUserCart };