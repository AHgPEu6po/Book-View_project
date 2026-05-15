import { generateCinemaSeed, removeCinemaSeed } from "../services/seed/cinemaSeed.js";
import { generateFilmSeed, removeFilmSeed } from "../services/seed/filmSeed.js";
import generateUserSeed from "../services/seed/userSeed.js";
import generateHistorySeed from "../services/seed/historySeed.js";
import generateSessionSeed from "../services/seed/sessionSeed.js";

const seedCinemas = async (req, res) => {

  try {

    const result = await generateCinemaSeed();

    res.json({
      success: true,
      message: `${result.length} кінотеатрів створено`,
      cinemas: result,
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

const clearCinemas = async (req, res) => {

  try {

    await removeCinemaSeed();

    res.json({
      success: true,
      message: "Кінотеатри видалені",
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

const seedFilms = async (req, res) => {

  try {

    const result = await generateFilmSeed();

    res.json({
      success: true,
      message: `${result.films.length} фільмів створено`,
      films: result,
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

const clearFilms = async (req, res) => {

  try {

    await removeFilmSeed();

    res.json({
      success: true,
      message: "Фільми видалені",
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

const seedUsers = async (req, res) => {

  try {

    const result = await generateUserSeed();

    res.json({
      success: true,
      message: `${result.users.length} користувачів створено`,
      users: result,
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

const seedHistory = async (req, res) => {
  try {
    const result = await generateHistorySeed();
    res.json(result);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const seedSessions = async (req, res) => {
  try {

    const result = await generateSessionSeed();

    res.json(result);

  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { seedCinemas, clearCinemas, seedFilms, clearFilms, seedUsers, seedHistory, seedSessions };