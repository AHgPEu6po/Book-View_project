import { contentBasedScore } from "./contentBased.js";
import { collaborativeScore } from "./collaborative.js";
import { heuristicScore } from "./heuristic.js";
import { finalScore } from "./scoring.js";
import { recommendationLog } from "../../utils/recommendationLogger.js";

const hybridScore = async ({ user, users, films }) => {

  recommendationLog("\nМОДУЛЬ ГІБРИДНОГО АНАЛІЗУ");

  const recommendations = [];

  const allowCollaborative = (user.history).length > 10;

  recommendationLog(
    `Колаборативний модуль: ${
      allowCollaborative
        ? "УВІМКНЕНО"
        : "ВИМКНЕНО"
    }\n`
  );

  for (const item of films) {

    const { film } = item;

    recommendationLog("\n--------------------------------");
    recommendationLog(`Аналіз фільму: ${film.name}`);
    recommendationLog(`Жанри: ${(film.category || []).join(", ")}`);

    const content = contentBasedScore(user, film);
    recommendationLog(`Контент-орієнтований бал: ${content.toFixed(2)}`);

    let collaborative = 0;

    if (allowCollaborative) {
      collaborative =
        await collaborativeScore({
          currentUser: user,
          users,
          film,
        });

      recommendationLog(`Колаборативний бал: ${collaborative.toFixed(2)}`);

    } else {
      recommendationLog("Колаборативний модуль пропущено (недостатньо історії)");
      recommendationLog("Колаборативний бал: 0.00");
    }

    const heuristic = heuristicScore({ user, film });
    recommendationLog(`Евристичний бал: ${heuristic.toFixed(2)}`);

    const final =
      finalScore({
        contentScore: content,
        collaborativeScore: collaborative,
        heuristicScore: heuristic,
      });

    recommendationLog(`Фінальний комбінований бал: ${final.toFixed(2)}`);

    recommendations.push({
      film,
      score: final,

      details: {
        content,
        collaborative,
        heuristic,
      },
    });
  }

  return recommendations;
};

export { hybridScore };