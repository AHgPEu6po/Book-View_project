import { cosineSimilarity } from "./similarity.js";
import { recommendationLog } from "../../utils/recommendationLogger.js";

const buildRatingMap = (user) => {
  const ratings = {};

  for (const item of user.history || []) {
    if (item.film_id && item.rating) {
      ratings[item.film_id._id.toString()] = item.rating;
    }
  }

  return ratings;
};

const collaborativeScore = async ({ currentUser, users, film }) => {

  recommendationLog("\n========== КОЛАБОРАТИВНА МОДЕЛЬ ==========");
  recommendationLog(`Фільм: ${film.name}`);

  const currentUserRatings = buildRatingMap(currentUser);
  const ratedCount = Object.keys(currentUserRatings).length;

  recommendationLog(`Оцінок користувача: ${ratedCount}`);

  if (ratedCount < 10) {
    recommendationLog("Недостатньо історії (<10) → колаборативний бал = 0");
    return 0;
  }

  let weightedSum = 0;
  let similarityAbsSum = 0;
  let usedUsers = 0;

  for (const user of users) {

    const otherRatings = buildRatingMap(user);

    const similarity = cosineSimilarity(
      currentUserRatings,
      otherRatings
    );

    if (similarity <= 0.05) continue;

    const ratedFilm = user.history?.find((item) =>
        item.film_id?._id?.toString() === film._id.toString()
    );

    if (!ratedFilm?.rating) continue;

    usedUsers++;

    weightedSum += similarity * ratedFilm.rating;
    similarityAbsSum += Math.abs(similarity);
  }

  if (similarityAbsSum === 0) {
    recommendationLog("Немає релевантних користувачів");
    return 0;
  }

  const predictedRating =
    weightedSum / similarityAbsSum;

  recommendationLog(`Схожих користувачів: ${usedUsers}`);
  recommendationLog(`weightedSum: ${weightedSum.toFixed(4)}`);
  recommendationLog(`|similarity| sum: ${similarityAbsSum.toFixed(4)}`);
  recommendationLog(`COLLAB SCORE (r̂_ui): ${predictedRating.toFixed(4)}`);
  recommendationLog("=========================================\n");

  return Math.min(10, predictedRating);
};

export { collaborativeScore, buildRatingMap };