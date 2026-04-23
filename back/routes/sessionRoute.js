import express from "express";
import { createSession, deleteSession, getSessionData, updateSeats } from "../controllers/sessionController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const sessionRouter = express.Router();

sessionRouter.post("/create", adminAuth, createSession);
sessionRouter.post("/delete", adminAuth, deleteSession);
sessionRouter.post("/get", getSessionData);
sessionRouter.post("/book", authUser, updateSeats);


export default sessionRouter;