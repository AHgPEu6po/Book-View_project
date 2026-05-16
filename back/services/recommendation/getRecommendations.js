import filmModel from "../../models/filmModel.js";
import userModel from "../../models/userModel.js";
import sessionListModel from "../../models/sessionListModel.js";
import { hybridScore } from "./hybrid.js";
import { getFilmPopularityMap } from "./popularityModel.js";

import {
  recommendationLog,
  clearRecommendationLog,
} from "../../utils/recommendationLogger.js";

const AGE_PRIORITY = {
  "0+": 0,
  "3A+": 3,
  "12+": 12,
  "16+": 16,
  "18+": 18,
};

const getAgeNumber = (rating) =>
  AGE_PRIORITY[rating] || 0;

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

  const isColdUser =
    (!user.history || user.history.length === 0) &&
    (!user.favoriteGenres || user.favoriteGenres.length === 0);

  const safeCity = user.city || null;
  const safeDistrict = user.district || null;

  const safeFavoriteGenres = user.favoriteGenres || [];
  const safeExcludedGenres = user.excludedGenres || [];

  recommendationLog(`Користувач: ${user.name}`);
  recommendationLog(`Місто: ${safeCity ?? "не вказано"}`);
  recommendationLog(`Район: ${safeDistrict ?? "не вказано"}`);
  recommendationLog(`Улюблені жанри: ${safeFavoriteGenres.join(", ") || "немає"}`);
  recommendationLog(`Виключені жанри: ${safeExcludedGenres.join(", ")}\n`);

  const films = await filmModel.find({
    lists: { $exists: true, $ne: [] }
  });

  const userAge =
    user.birthYear
      ? new Date().getFullYear() - user.birthYear
      : null;

  recommendationLog(
    `Вік користувача: ${userAge ?? "невідомо"}\n`
  );

  const recommendations = [];

  if (isColdUser) {
    recommendationLog("Cold start → popularity model");

    const popularityMap = await getFilmPopularityMap();

    const fallback = films
      .map((film) => {
        const id = film._id.toString();

        const score =
          (popularityMap[id] || 0) * 0.9 +
          (film.lists?.length || 0) * 0.1;

        return { film, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    recommendationLog("\n=============================");
    recommendationLog("FALLBACK (POPULARITY MODEL)");
    recommendationLog("=============================");

    fallback.forEach((item, i) => {
      recommendationLog(
        `${i + 1}. ${item.film.name} (${item.score.toFixed(2)})`
      );
    });

    return fallback;
  }

  for (const film of films) {

    recommendationLog(`\n--------------------------------`);
    recommendationLog(`Аналіз фільму: ${film.name}`);
    recommendationLog(`ID: ${film._id}`);
    recommendationLog(`Жанри: ${(film.category || []).join(", ")}`);
    recommendationLog(`Віковий рейтинг: ${film.ageRating}`);

    const filmAge = getAgeNumber(film.ageRating);

    if (userAge !== null && filmAge > userAge) {
      recommendationLog("Фільм відхилено через вікове обмеження");
      continue;
    }

    const lists = await sessionListModel
      .find({ _id: { $in: film.lists || [] } })
      .populate("cinema_id");

    let validLists = lists;

    if (user.city) {
      validLists = lists.filter(
        (list) =>
          list.cinema_id?.city === user.city
      );
    }

    if (validLists.length === 0) {
      recommendationLog(
        user.city
          ? "Фільм відхилено (немає кінотеатрів у місті)"
          : "Фільм пропущено гео-фільтр вимкнено"
      );

      if (!user.city) {
        validLists = lists;
      }

      if (validLists.length === 0) continue;
    }

    const cinema = validLists[0].cinema_id;

    recommendationLog(`Кінотеатр: ${cinema?.name || "невідомо"}`);
    recommendationLog(`Місто кінотеатру: ${cinema?.city || "?"}`);
    recommendationLog(`Район кінотеатру: ${cinema?.district || "?"}`);

    const scoreData = await hybridScore({
      user,
      film,
      cinema,
    });

    const finalScore = scoreData?.final ?? 0;

    recommendations.push({
      film,
      cinema,
      score: finalScore,
    });

    recommendationLog(
      `ФІНАЛЬНИЙ БАЛ: ${finalScore.toFixed(2)}`
    );
  }

  recommendations.sort((a, b) => b.score - a.score);

  recommendationLog("\n=============================");
  recommendationLog("ТОП РЕКОМЕНДАЦІЙ");
  recommendationLog("=============================");

  recommendations.slice(0, 10).forEach((item, index) => {
    recommendationLog(
      `${index + 1}. ${item.film.name} (${item.score.toFixed(2)})`
    );
  });

  return recommendations.slice(0, 10);
};

export default getRecommendations;