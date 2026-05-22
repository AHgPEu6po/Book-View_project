import filmModel from "../../models/filmModel.js";
import userModel from "../../models/userModel.js";
import { hybridScore } from "./hybrid.js";
import { getFilmPopularityMap } from "./popularityModel.js";
import { recommendationLog, clearRecommendationLog } from "../../utils/recommendationLogger.js";

const AGE_PRIORITY = {
  "0+": 0,
  "3A+": 3,
  "12+": 12,
  "16+": 16,
  "18+": 18,
};

const getAgeNumber = (rating) =>
  AGE_PRIORITY[rating] || 0;

const logTopRecommendations = (
  recommendations
) => {

  recommendationLog("\n=============================");
  recommendationLog("ТОП РЕКОМЕНДАЦІЙ");
  recommendationLog("=============================");

  recommendations
    .slice(0, 10)
    .forEach((item, index) => {
      recommendationLog(
        `${index + 1}. ${item.film.name} (${item.score.toFixed(2)})`
      );
    });
};

const getRecommendations = async (userId) => {

  clearRecommendationLog();

  recommendationLog("=============================");
  recommendationLog("ПОЧАТОК РОБОТИ СППР");
  recommendationLog("=============================\n");

  const user = await userModel
    .findById(userId)
    .populate("history.film_id");

  if (!user) {
    recommendationLog("Користувача не знайдено");
    return [];
  }

  const userAge =
    user.birthYear
      ? new Date().getFullYear() - user.birthYear
      : null;

  const safeCity = user.city || null;
  const safeDistrict = user.district || null;
  const favoriteGenres = user.favoriteGenres || [];
  const excludedGenres = user.excludedGenres || [];

  const isColdUser =
    (!user.history || user.history.length <= 10) &&
    (!favoriteGenres || favoriteGenres.length === 0);

  recommendationLog(`Користувач: ${user.name}`);
  recommendationLog(`Вік: ${userAge ?? "не вказано"}`);
  recommendationLog(`Місто: ${safeCity ?? "не вказано"}`);
  recommendationLog(`Район: ${safeDistrict ?? "не вказано"}`);
  recommendationLog(`Улюблені жанри: ${favoriteGenres.join(", ") || "немає"}`);
  recommendationLog(`Виключені жанри: ${excludedGenres.join(", ") || "немає"}\n`);

  recommendationLog("Отримання доступних фільмів...");

  const films = await filmModel.find({
    lists: {
      $exists: true,
      $ne: [],
    },
  })
  .populate({
    path: "lists",
    populate: {
      path: "cinema_id",
      select:
        "name city district",
    },
  });
  
  recommendationLog(`Отримано фільмів: ${films.length}`);

  recommendationLog("\nФільтрація фільмів...");

  const filteredFilms = [];

  for (const film of films) {

    const filmAge = getAgeNumber(film.ageRating);

    if (
      userAge !== null &&
      filmAge > userAge
    ) {
      recommendationLog(
        `${film.name} -> виключено по віку`
      );
      continue;
    }

    let validCinema = null;

    for (const sessionList of film.lists || []) {

      const cinema = sessionList?.cinema_id;

      if (!safeCity) {
        validCinema = cinema;
        break;
      }

      if (
        cinema.city === safeCity
      ) {
        validCinema = cinema;
        break;
      }
    }

    if (!validCinema) {
      recommendationLog(`${film.name} -> виключено по місту`);
      continue;
    }

    filteredFilms.push({ film });
  }

  recommendationLog(`Після фільтрації залишилось: ${filteredFilms.length} фільмів\n`);
  recommendationLog("Отримання інших користувачів...");

  const users = await userModel
    .find({
      _id: {
        $ne: user._id,
      },
    })
    .populate("history.film_id");

  recommendationLog(`Отримано користувачів: ${users.length}\n`);

  if (isColdUser) {

    recommendationLog("Cold Start користувач");
    recommendationLog("Запуск popularity model...\n");

    const recommendations =
      await getFilmPopularityMap(
        filteredFilms,
        users,
      );

    recommendations.sort(
      (a, b) => b.score - a.score
    );

    logTopRecommendations(recommendations);
    return recommendations.slice(0, 10);
  }

  recommendationLog("Запуск hybrid model...\n");

  const recommendations =
    await hybridScore({
      user,
      users,
      films: filteredFilms,
    });

  recommendations.sort(
    (a, b) => b.score - a.score
  );

  logTopRecommendations(recommendations);

  return recommendations.slice(0, 10);
};

export default getRecommendations;