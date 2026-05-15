import fs from "fs";
import path from "path";
import userModel from "../../models/userModel.js";

const randDate2025 = () => {
  const start = new Date("2025-01-01").getTime();
  const end = new Date("2025-12-31").getTime();
  return new Date(start + Math.random() * (end - start));
};

const loadJSON = (file) => {
  const filePath = path.join(process.cwd(), "data", file);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

const generateHistorySeed = async () => {

  const usersHidden = loadJSON("userHiddenData.json");
  const filmsHidden = loadJSON("filmHiddenData.json");

  const users = await userModel.find();

  for (const user of users) {
    const hidden = usersHidden.find(u => u.user_id === user._id.toString());
    const ratingCoverage = hidden?.ratingCoverage ?? 0;

    const history = [];

    for (const film of filmsHidden) {
      const watchChance = film.popularity / 100;

      if (Math.random() > watchChance) continue;

      const sessionDate = randDate2025();

      let rating = null;

      if (Math.random() < ratingCoverage / 100) {
        const base = film.rating;

        const noise = (Math.random() - 0.5) * 4;
        rating = Math.max(1, Math.min(10, +(base + noise).toFixed(1)));
      }

      history.push({
        film_id: film.film_id,
        sessionDate,
        rating,
      });
    }

    await userModel.updateOne(
      { _id: user._id },
      { $set: { history } }
    );
  }

  return { success: true };
};

export default generateHistorySeed;