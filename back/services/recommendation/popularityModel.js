import userModel from "../../models/userModel.js";
import filmModel from "../../models/filmModel.js";

const getFilmPopularityMap = async () => {
  const users = await userModel.find().populate("history.film_id");

  const stats = new Map();

  for (const user of users) {
    for (const item of user.history || []) {
      if (!item.film_id || !item.rating) continue;

      const id = item.film_id._id.toString();

      if (!stats.has(id)) {
        stats.set(id, {
          sum: 0,
          count: 0,
        });
      }

      const data = stats.get(id);
      data.sum += item.rating;
      data.count += 1;
    }
  }

  const result = {};

  for (const [filmId, data] of stats.entries()) {
    const avg = data.sum / data.count;

    const volumeBoost = Math.log(data.count + 1);

    result[filmId] = avg * 0.8 + volumeBoost * 0.2;
  }

  return result;
};

export { getFilmPopularityMap };