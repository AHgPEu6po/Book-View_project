import { cosineSimilarity } from "./similarity.js";

const buildUserVector = (user) => {

  const vector = {};

  for (const genre of user.favoriteGenres || []) {
    vector[genre] = (vector[genre] || 0) + 5;
  }

  for (const item of user.history || []) {

    if (
      !item.film_id ||
      !item.rating
    ) continue;

    for ( const genre of item.film_id.category || [] ) 
    {
      vector[genre] = (vector[genre] || 0) + item.rating;
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

const contentBasedScore = ( user, film ) => {

  const userVector = buildUserVector(user);

  const filmVector = buildFilmVector(film);

  return cosineSimilarity(
    userVector,
    filmVector
  );
};

export { contentBasedScore };