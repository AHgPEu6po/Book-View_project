import { recommendationLog } from "../../utils/recommendationLogger.js";

const heuristicScore = ({ user, film }) => {

  recommendationLog("\nЕвристичний аналіз");

  let score = 0;

  if (film.isPremiere) {
    recommendationLog("Прем'єра: +25");
    score += 25;
  }

  for (const genre of film.category || []) {

    if (
      user.favoriteGenres?.includes( genre )
    ) {
      recommendationLog(`Улюблений жанр ${genre}: +5`);
      score += 5;
    }
  }

  for (const genre of film.category || []) {

    if (
      user.excludedGenres?.includes(genre)
    ) {
      recommendationLog(`Виключений жанр ${genre}: -10`);
      score -= 10;
    }
  }

  for (const sessionList of film.lists || []) {

    const cinema = sessionList?.cinema_id;

    if (!cinema) {
      continue;
    }

    if (
      user.city &&
      cinema.city === user.city
    ) {

      if (
        user.district &&
        cinema.district === user.district
      ) {
        recommendationLog("Співпадіння району: +2");
        score += 2;
        break;
      }
    }
  }

  recommendationLog(`Підсумковий евристичний бал: ${score}`);

  return score;
};

export { heuristicScore };