import express from "express";
import { createSessionList, deleteSessionList, getSessionListData, listAllSessionLists } from "../controllers/sessionListController.js";
import adminAuth from "../middleware/adminAuth.js";

const sessionListRouter = express.Router();

sessionListRouter.post("/create", adminAuth, createSessionList);
sessionListRouter.post("/delete", adminAuth, deleteSessionList);
sessionListRouter.get("/all", listAllSessionLists);
sessionListRouter.post("/get", getSessionListData);

export default sessionListRouter;