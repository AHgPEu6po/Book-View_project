import { contentBasedScore } from "./contentBased.js";
import { collaborativeScore } from "./collaborative.js";
import { heuristicScore } from "./heuristic.js";
import { finalScore } from "./scoring.js";

import {
  recommendationLog,
} from "../../utils/recommendationLogger.js";

const hybridScore = async ({
  user,
  film,
  cinema
}) => {

  recommendationLog(
    "\nМОДУЛЬ ГІБРИДНОГО АНАЛІЗУ"
  );

  const content =
    contentBasedScore(user, film);

  recommendationLog(
    `Контент-орієнтований бал: ${content.toFixed(2)}`
  );

  const collaborative =
    await collaborativeScore(user, film);

  recommendationLog(
    `Колаборативний бал: ${collaborative.toFixed(2)}`
  );

  const heuristic =
    heuristicScore({
      user,
      film,
      cinema,
    });

  recommendationLog(
    `Евристичний бал: ${heuristic.toFixed(2)}`
  );

  const final = finalScore({
    contentScore: content,
    collaborativeScore: collaborative,
    heuristicScore: heuristic,
  });

  recommendationLog(
    `Фінальний комбінований бал: ${final.toFixed(2)}`
  );

  return {
    content,
    collaborative,
    heuristic,
    final,
  };
};

export { hybridScore };