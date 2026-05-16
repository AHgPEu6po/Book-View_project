import userModel from "../../models/userModel.js";

import {
  recommendationLog,
} from "../../utils/recommendationLogger.js";

const cosineUserSimilarity = (
  currentUserRatings,
  otherUserRatings
) => {

  let numerator = 0;

  let currentNorm = 0;
  let otherNorm = 0;

  const commonFilmIds = Object.keys(
    currentUserRatings
  ).filter(
    (filmId) =>
      otherUserRatings[filmId] !== undefined
  );

  if (commonFilmIds.length === 0) {
    return 0;
  }

  for (const filmId of commonFilmIds) {

    const currentRating =
      currentUserRatings[filmId];

    const otherRating =
      otherUserRatings[filmId];

    numerator +=
      currentRating * otherRating;

    currentNorm +=
      currentRating * currentRating;

    otherNorm +=
      otherRating * otherRating;
  }

  if (!currentNorm || !otherNorm) {
    return 0;
  }

  return (
    numerator /
    (
      Math.sqrt(currentNorm) *
      Math.sqrt(otherNorm)
    )
  );
};

const buildRatingMap = (user) => {

  const ratings = {};

  for (const item of user.history || []) {

    if (
      item.film_id &&
      item.rating
    ) {

      ratings[
        item.film_id._id.toString()
      ] = item.rating;
    }
  }

  return ratings;
};

const collaborativeScore = async (
  currentUser,
  film
) => {

  recommendationLog(
    "\n========== КОЛАБОРАТИВНА МОДЕЛЬ =========="
  );

  recommendationLog(
    `Фільм: ${film.name}`
  );

  const users = await userModel
    .find({
      _id: {
        $ne: currentUser._id
      }
    })
    .populate("history.film_id");

  const currentUserRatings =
    buildRatingMap(currentUser);

  recommendationLog(
    `Оцінок у поточного користувача: ${
      Object.keys(currentUserRatings).length
    }`
  );

  let weightedSum = 0;

  let similaritySum = 0;

  for (const user of users) {

    const otherUserRatings =
      buildRatingMap(user);

    const similarity =
      cosineUserSimilarity(
        currentUserRatings,
        otherUserRatings
      );

    if (similarity <= 0) {
      continue;
    }

    const ratedFilm =
      user.history.find(
        (item) =>
          item.film_id?._id?.toString() ===
          film._id.toString()
      );

    if (
      !ratedFilm ||
      !ratedFilm.rating
    ) {
      continue;
    }

    recommendationLog(
      `\nКористувач: ${user.name}`
    );

    recommendationLog(
      `Схожість sim(u,v): ${similarity.toFixed(4)}`
    );

    recommendationLog(
      `Оцінка фільму r_vi: ${ratedFilm.rating}`
    );

    weightedSum +=
      similarity *
      ratedFilm.rating;

    similaritySum +=
      Math.abs(similarity);

    recommendationLog(
      `Поточна зважена сума: ${weightedSum.toFixed(4)}`
    );

    recommendationLog(
      `Поточна сума схожостей: ${similaritySum.toFixed(4)}`
    );
  }

  if (similaritySum === 0) {

    recommendationLog(
      "\nНе знайдено схожих користувачів"
    );

    recommendationLog(
      "Колаборативний бал: 0"
    );

    return 0;
  }
 
  const predictedRating =
    weightedSum /
    similaritySum;

  recommendationLog(
    "\nФІНАЛЬНИЙ РОЗРАХУНОК:"
  );

  recommendationLog(
    `weightedSum = ${weightedSum.toFixed(4)}`
  );

  recommendationLog(
    `similaritySum = ${similaritySum.toFixed(4)}`
  );

  recommendationLog(
    `Прогнозований рейтинг r̂_ui = ${predictedRating.toFixed(4)}`
  );

  recommendationLog(
    "=========================================\n"
  );

  return predictedRating;
};

export { collaborativeScore };