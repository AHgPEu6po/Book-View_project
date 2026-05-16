const finalScore = ({
  contentScore,
  collaborativeScore,
  heuristicScore,
}) => {
  const result =
    contentScore * 0.4 +
    collaborativeScore * 0.6 +
    heuristicScore * 0.1;

  return result;
};

export { finalScore };