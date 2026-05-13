import userModel from "../../models/userModel.js";

const collaborativeScore = async ( currentUser, film ) => {

  const users = await userModel
    .find({ _id: { $ne: currentUser._id }})
    .populate("history.film_id");

  let score = 0;
  let matches = 0;

  for (const user of users) {

    const hasCommonGenres = user.favoriteGenres?.some(
        (genre) =>
          currentUser.favoriteGenres?.includes(
            genre
          )
      );

    if (!hasCommonGenres) {
      continue;
    }

    const ratedFilm =
      user.history.find((item) =>
          item.film_id?._id?.toString() ===
          film._id.toString()
      );

    if (
      ratedFilm &&
      ratedFilm.rating
    ) {
      score += ratedFilm.rating;
      matches++;
    }
  }

  if (!matches) {
    return 0;
  }

  return score / matches;
};

export { collaborativeScore };