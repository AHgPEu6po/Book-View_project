import express from "express";
import { createRoom, getRoom } from "../controllers/roomController.js";
import adminAuth from "../middleware/adminAuth.js";

const roomRouter = express.Router();

roomRouter.post("/create", adminAuth, createRoom);
roomRouter.post("/get", getRoom);

export default roomRouter;