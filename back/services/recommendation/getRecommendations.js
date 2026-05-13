import filmModel from "../../models/filmModel.js";
import userModel from "../../models/userModel.js";
import sessionListModel from "../../models/sessionListModel.js";
import { hybridScore } from "./hybrid.js";

const AGE_PRIORITY = {
  "0+": 0,
  "3A+": 3,
  "12+": 12,
  "16+": 16,
  "18+": 18,
};

const getAgeNumber = (rating) =>
  AGE_PRIORITY[rating] || 0;

const getRecommendations = async ( userId ) => {

  const user = await userModel
    .findById(userId)
    .populate("history.film_id");

  const films = await filmModel.find({
    lists: { $exists: true, $ne: [] }
  });

  const userAge =
    new Date().getFullYear() -
    user.birthYear;

  const recommendations = [];

  for (const film of films) {

    if (
      getAgeNumber(film.ageRating) > userAge
    ) {
      continue;
    }

    const lists = await sessionListModel
      .find({ _id: { $in: film.lists }})
      .populate("cinema_id");

    const validLists = lists.filter(
      (list) =>
        list.cinema_id?.city ===
        user.city
      );

    if (validLists.length === 0) {
      continue;
    }

    const cinema = validLists[0].cinema_id;
    const score = await hybridScore({ user, film, cinema });

    recommendations.push({ film, cinema, score });
  }

  console.log(recommendations);

  recommendations.sort(
    (a, b) => b.score - a.score
  );

  return recommendations.slice(0, 10);
};

export default getRecommendations;