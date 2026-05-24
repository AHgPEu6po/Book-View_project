import { buildRatingMap } from "../services/recommendation/collaborative.js";
import { cosineSimilarity } from "../services/recommendation/similarity.js";
import { finalScore } from "../services/recommendation/scoring.js";
import { buildUserVector, buildFilmVector } from "../services/recommendation/contentBased.js";

describe("Recommendation Services", () => {

  describe("buildRatingMap", () => {
    it("should build correct rating map", () => {
      const user = {
        history: [
          {
            film_id: { _id: "film1" },
            rating: 5,
          },
          {
            film_id: { _id: "film2" },
            rating: 3,
          },
        ],
      };

      const result = buildRatingMap(user);

      expect(result).toEqual({
        film1: 5,
        film2: 3,
      });
    });

    it("should ignore missing rating or film_id", () => {
      const user = {
        history: [
          { film_id: null, rating: 5 },
          { film_id: { _id: "film3" }, rating: null },
        ],
      };

      expect(buildRatingMap(user)).toEqual({});
    });
  });

  describe("buildUserVector", () => {
    it("should build normalized genre vector", () => {
      const user = {
        history: [
          {
            film_id: {
              category: ["Action", "Drama"],
            },
            rating: 5,
          },
        ],
        favoriteGenres: ["Comedy"],
      };

      const result = buildUserVector(user);

      expect(result.Action).toBeDefined();
      expect(result.Drama).toBeDefined();
      expect(result.Comedy).toBeDefined();

      const sum = Object.values(result).reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1);
    });
  });

  describe("buildFilmVector", () => {
    it("should build film vector", () => {
      const film = {
        category: ["Action", "Sci-Fi"],
      };

      const result = buildFilmVector(film);

      expect(result).toEqual({
        Action: 1,
        "Sci-Fi": 1,
      });
    });
  });

  describe("cosineSimilarity", () => {
    it("should return 1 for identical vectors", () => {
      const a = { Action: 1, Drama: 1 };
      const b = { Action: 1, Drama: 1 };

      const result = cosineSimilarity(a, b);

      expect(result).toBeCloseTo(1);
    });

    it("should return 0 for empty vectors", () => {
      expect(cosineSimilarity({}, {})).toBe(0);
    });

    it("should compute partial similarity", () => {
      const a = { Action: 1, Drama: 0 };
      const b = { Action: 1, Comedy: 1 };

      const result = cosineSimilarity(a, b);

      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(1);
    });
  });

  describe("finalScore", () => {
    it("should calculate weighted score correctly", () => {
      const result = finalScore({
        contentScore: 1,
        collaborativeScore: 1,
        heuristicScore: 1,
      });

      expect(result).toBeCloseTo(1);
    });

    it("should handle zero scores", () => {
      const result = finalScore({
        contentScore: 0,
        collaborativeScore: 0,
        heuristicScore: 0,
      });

      expect(result).toBe(0);
    });
  });

});