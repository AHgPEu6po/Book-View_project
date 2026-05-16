import {
  recommendationLog,
} from "../../utils/recommendationLogger.js";

const heuristicScore = ({
  user,
  film,
  cinema
}) => {

  recommendationLog(
    "\nЕвристичний аналіз"
  );

  let score = 0;

  if (film.isPremiere) {

    recommendationLog(
      "Прем'єра: +10"
    );

    score += 10;
  }

  for (const genre of film.category || []) {

    if (
      user.favoriteGenres?.includes(
        genre
      )
    ) {

      recommendationLog(
        `Улюблений жанр ${genre}: +5`
      );

      score += 5;
    }
  }

  for (const genre of film.category || []) {

    if (
      user.excludedGenres?.includes(
        genre
      )
    ) {

      recommendationLog(
        `Виключений жанр ${genre}: -100`
      );

      score -= 100;
    }
  }

  if (
    user.district &&
    cinema.district &&
    user.district === cinema.district
  ) {

    recommendationLog(
      "Співпадіння району: +2"
    );

    score += 2;
  }

  recommendationLog(
    `Підсумковий евристичний бал: ${score}`
  );

  return score;
};

export { heuristicScore };