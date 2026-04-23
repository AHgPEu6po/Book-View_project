import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import sessionModel from "../models/sessionModel.js";
import sessionListModel from "../models/sessionListModel.js";
import logger from "../config/logger.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { origin } = req.headers;

    const user = await userModel.findById(userId);
    const cartData = user.cartData || {};

    if (Object.keys(cartData).length === 0) {
      return res.json({ success: false, message: "Cart is empty" });
    }

    const createdOrders = [];
    let line_items = [];

    for (const sessionId of Object.keys(cartData)) {

      const selectedSeats = cartData[sessionId];

      const session = await sessionModel.findById(sessionId);
      const sessionList = await sessionListModel.findById(session.list_id);

      const film_id = sessionList.film_id;

      let totalPrice = 0;
      const seatsToSave = [];

      for (const seat of selectedSeats) {
        const found = session.seats.find(
          s => s.row === seat.row && s.number === seat.number
        );

        if (!found) continue;

        totalPrice += found.price;

        seatsToSave.push({
          row: found.row,
          number: found.number,
          price: found.price
        });

        line_items.push({
          price_data: {
            currency: "uah",
            product_data: {
              name: `Ряд ${found.row}, місце ${found.number}`
            },
            unit_amount: found.price * 100
          },
          quantity: 1
        });
      }

      const order = await orderModel.create({
        user_id: userId,
        film_id,
        session_id: sessionId,
        seats: seatsToSave,
        totalPrice,
        status: "pending"
      });

      createdOrders.push(order._id);
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true`,
      cancel_url: `${origin}/verify?success=false`,
      line_items,
      mode: "payment"
    });

    res.json({
      success: true,
      session_url: stripeSession.url,
      orderIds: createdOrders
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyStripe = async (req, res) => {
  try {
    const { success, orderIds, userId } = req.body;

    if (success !== "true") {
      await orderModel.deleteMany({ _id: { $in: orderIds } });
      return res.json({ success: false });
    }

    for (const orderId of orderIds) {
      const order = await orderModel.findById(orderId);
      const session = await sessionModel.findById(order.session_id);

      for (const seat of order.seats) {
        const found = session.seats.find(
          s => s.row === seat.row && s.number === seat.number
        );

        if (!found || !found.isAvailable) {
          return res.json({
            success: false,
            message: "Some seats already taken"
          });
        }
      }

      session.seats = session.seats.map(s => {
        const match = order.seats.find(
          seat => seat.row === s.row && seat.number === s.number
        );

        if (match) {
          return { ...s.toObject(), isAvailable: false };
        }

        return s;
      });

      await session.save();

      order.status = "paid";
      await order.save();

      await userModel.findByIdAndUpdate(userId, {
        $push: { history: order._id }
      });
    }

    await userModel.findByIdAndUpdate(userId, {
      cartData: {}
    });

    res.json({ success: true });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await orderModel
      .find({ user_id: userId })
      .populate("film_id")
      .populate("session_id")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    logger.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (order.status === "cancelled") {
      return res.json({ success: false, message: "Already cancelled" });
    }

    const session = await sessionModel.findById(order.session_id);

    session.seats = session.seats.map(s => {
      const match = order.seats.find(
        seat => seat.row === s.row && seat.number === s.number
      );

      if (match) {
        return { ...s.toObject(), isAvailable: true };
      }

      return s;
    });

    await session.save();

    order.status = "cancelled";
    await order.save();

    res.json({ success: true });

  } catch (error) {
    logger.error(error.message);
    res.json({ success: false, message: error.message });
  }
};


export { placeOrderStripe, verifyStripe, getUserOrders, cancelOrder };