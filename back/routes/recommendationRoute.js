import express from "express";
import authUser from '../middleware/auth.js'
import { getPersonalRecommendations } from "../controllers/recommendationController.js";

const recommendationRoute = express.Router();

recommendationRoute.get( "/personal", authUser, getPersonalRecommendations );

export default recommendationRoute;