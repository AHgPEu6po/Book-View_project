import { cosineSimilarity } from "./similarity.js";
import { recommendationLog } from "../../utils/recommendationLogger.js";

const buildUserVector = (user) => {

  const vector = {};
  let total = 0;

  for (const item of user.history || []) {

    if (!item.film_id?.category) continue;

    const weight = item.rating
      ? item.rating / 5
      : 1;

    for (const genre of item.film_id.category) {
      vector[genre] = (vector[genre] || 0) + weight;
      total += weight;
    }
  }

  for (const genre of user.favoriteGenres || []) {
    vector[genre] = (vector[genre] || 0) + 1;
    total += 1;
  }

  if (total > 0) {
    for (const key in vector) {
      vector[key] = vector[key] / total;
    }
  }

  return vector;
};

const buildFilmVector = (film) => {
  const vector = {};
  for (const genre of film.category || []) {
    vector[genre] = 1;
  }
  return vector;
};

const contentBasedScore = (user, film) => {

  recommendationLog("\nКонтент-орієнтований аналіз");

  const userVector = buildUserVector(user);
  const filmVector = buildFilmVector(film);

  recommendationLog(`Вектор користувача: ${JSON.stringify(userVector)}`);
  recommendationLog(`Вектор фільму: ${JSON.stringify(filmVector)}`);

  const similarity = cosineSimilarity(userVector, filmVector);

  recommendationLog(`Косинусна схожість: ${similarity.toFixed(4)}`);

  const scaled = Math.max(0, similarity) * 10;

  return scaled;
};

export { contentBasedScore };