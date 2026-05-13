const heuristicScore = ({ user, film, cinema }) => {

  let score = 0;

  if (film.isPremiere) {
    score += 3;
  }

  for (const genre of film.category || []) {
    if (user.favoriteGenres?.includes(genre)) 
    {
      score += 2;
    }
  }

  for (const genre of film.category || []) {
    if (user.excludedGenres?.includes(genre)) 
    {
      score -= 100;
    }
  }

  if (
    user.district &&
    cinema.district &&
    user.district === cinema.district
  ) {
    score += 5;
  }

  return score;
};

export { heuristicScore };