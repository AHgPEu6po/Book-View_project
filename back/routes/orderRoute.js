import express from "express";
import authUser from "../middleware/auth.js";
import { placeOrderStripe, verifyStripe, getUserOrders, cancelOrder, deleteOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authUser, placeOrderStripe);
orderRouter.post("/verify", authUser, verifyStripe);
orderRouter.get("/user", authUser, getUserOrders);
orderRouter.post("/cancel", authUser, cancelOrder);
orderRouter.post("/delete", deleteOrder);

export default orderRouter;