import { contentBasedScore } from "./contentBased.js";
import { collaborativeScore } from "./collaborative.js";
import { heuristicScore } from "./heuristic.js";
import { finalScore } from "./scoring.js";

const hybridScore = async ({ user, film, cinema }) => {

  const content = contentBasedScore( user, film );
  const collaborative = await collaborativeScore( user, film );
  const heuristic = heuristicScore({ user, film, cinema });

  return finalScore({
    contentScore: content,
    collaborativeScore: collaborative,
    heuristicScore: heuristic,
  });
};

export { hybridScore };