const getFilmPopularityMap = async (films, users) => {
  
  const stats = new Map();

  for (const user of users) {
    for (const item of user.history || []) {
      if (!item.film_id || !item.rating) continue;

      const id = item.film_id._id.toString();

      if (!stats.has(id)) {
        stats.set(id, {
          sum: 0,
          count: 0,
        });
      }

      const data = stats.get(id);
      data.sum += item.rating;
      data.count += 1;
    }
  }

  let totalSum = 0;
  let totalCount = 0;

  for (const data of stats.values()) {
    totalSum += data.sum;
    totalCount += data.count;
  }

  const globalAverage =
    totalCount > 0
      ? totalSum / totalCount
      : 0;

  const MIN_VOTES = 5;

  const recommendations = [];

  for (const item of films) {

    const { film, cinema } = item;
    const filmId = film._id.toString();
    const data = stats.get(filmId);

    if (!data) {
      recommendations.push({ film, cinema, score: 0 });
      continue;
    }

    const avgRating = data.sum / data.count;
    const votes = data.count;
    const weightedRating =
      (
        (votes / (votes + MIN_VOTES)) *
        avgRating
      ) +
      (
        (MIN_VOTES / (votes + MIN_VOTES)) *
        globalAverage
      );

    const popularityBoost =  Math.log(votes + 1);
    const finalScore = weightedRating * 0.8 + popularityBoost * 0.2;
    recommendations.push({ film, cinema, score: finalScore });
  }

  return recommendations;
};

export { getFilmPopularityMap };