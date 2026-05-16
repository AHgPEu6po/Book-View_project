import fs from "fs";
import path from "path";

const logPath = path.join(
  process.cwd(),
  "logs",
  "recommendation-log.txt"
);

const clearRecommendationLog = () => {

  fs.mkdirSync(
    path.dirname(logPath),
    { recursive: true }
  );

  fs.writeFileSync(logPath, "");
};

const recommendationLog = (text) => {

  fs.mkdirSync(
    path.dirname(logPath),
    { recursive: true }
  );

  fs.appendFileSync(
    logPath,
    text + "\n"
  );
};

export {
  recommendationLog,
  clearRecommendationLog,
};