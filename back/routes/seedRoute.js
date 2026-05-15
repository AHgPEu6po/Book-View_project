import express from "express";

import { seedCinemas, clearCinemas, seedFilms, clearFilms, seedUsers, seedHistory, seedSessions } from "../controllers/seedController.js";

const seedRoute = express.Router();

seedRoute.post( "/cinemas", seedCinemas );
seedRoute.delete( "/cinemas", clearCinemas );
seedRoute.post( "/films", seedFilms );
seedRoute.delete( "/films", clearFilms );
seedRoute.post( "/users", seedUsers );
seedRoute.post("/history", seedHistory);
seedRoute.post("/sessions", seedSessions);

export default seedRoute;