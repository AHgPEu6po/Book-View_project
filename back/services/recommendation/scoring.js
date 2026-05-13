const finalScore = ({
  contentScore,
  collaborativeScore,
  heuristicScore,
}) => {

  return (
    contentScore * 0.5 +
    collaborativeScore * 0.3 +
    heuristicScore * 0.2
  );
};

export { finalScore };