import express from "express";
import authUser from "../middleware/auth.js";
import { placeOrderStripe, verifyStripe, getUserOrders, cancelOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authUser, placeOrderStripe);
orderRouter.post("/verify", verifyStripe);
orderRouter.get("/user", authUser, getUserOrders);
orderRouter.post("/cancel", authUser, cancelOrder);

export default orderRouter;