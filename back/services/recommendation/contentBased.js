import { cosineSimilarity } from "./similarity.js";

import {
  recommendationLog,
} from "../../utils/recommendationLogger.js";

const buildUserVector = (user) => {
  const vector = {};

  for (const item of user.history || []) {
    if (!item.film_id?.category) continue;

    const genres = item.film_id.category;

    for (const genre of genres) {
      vector[genre] = (vector[genre] || 0) + 1;
    }
  }

  for (const genre of user.favoriteGenres || []) {
    vector[genre] = ((vector[genre] || 0) + 1) * 3;
  }

  return vector;
};

const buildUserDistribution = (user) => {
  const dist = {};
  let total = 0;

  for (const item of user.history || []) {
    if (!item.film_id?.category) continue;

    for (const g of item.film_id.category) {
      dist[g] = (dist[g] || 0) + 1;
      total++;
    }
  }

  for (const g of user.favoriteGenres || []) {
    dist[g] = ((dist[g] || 0) + 1) * 3;
    total++;
  }

  for (const k in dist) {
    dist[k] = dist[k] / total;
  }

  return dist;
};

const buildFilmVector = (film, userDist) => {
  const vector = {};

  for (const genre of film.category || []) {

    const userFreq = userDist[genre] || 0;

    const weight = 1 / (0.1 + userFreq);

    vector[genre] = weight;
  }

  return vector;
};

const contentBasedScore = (
  user,
  film
) => {

  recommendationLog(
    "\nКонтент-орієнтований аналіз"
  );

  const userVector = buildUserVector(user);
  const userDist = buildUserDistribution(user);

  const filmVector = buildFilmVector(film, userDist);

  recommendationLog(
    `Вектор користувача: ${JSON.stringify(userVector)}`
  );

  recommendationLog(
    `Вектор фільму: ${JSON.stringify(filmVector)}`
  );

  const similarity =
    cosineSimilarity(
      userVector,
      filmVector
    );

  recommendationLog(
    `Косинусна схожість: ${similarity.toFixed(2)}`
  );

  const amplified = Math.pow(similarity, 0.25) * 10;

  return amplified;
};

export { contentBasedScore };