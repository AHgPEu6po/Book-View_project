import { jest } from "@jest/globals";
import httpMocks from "node-mocks-http";

const filmModelMock = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
};

const cloudinaryMock = {
  uploader: {
    upload: jest.fn(),
  },
};

jest.unstable_mockModule("../models/filmModel.js", () => ({
  default: filmModelMock,
}));

jest.unstable_mockModule("cloudinary", () => ({
  v2: cloudinaryMock,
}));

jest.unstable_mockModule("../config/logger.js", () => ({
  default: {
    error: jest.fn(),
  },
}));

const {
  createFilm,
  changePremierStatus,
  listAllFilms,
  getFilmData,
  listEnableFilms,
} = await import("../controllers/filmController.js");

describe("Film Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createFilm", () => {
    it("should return error if required fields missing", async () => {
      const req = httpMocks.createRequest({
        body: {},
        file: null,
      });

      const res = httpMocks.createResponse();

      await createFilm(req, res);

      expect(res._getJSONData()).toEqual({
        success: false,
        message: "Missing required fields",
      });
    });
  });

  describe("changePremierStatus", () => {
    it("should return film not found", async () => {
      filmModelMock.findByIdAndUpdate.mockResolvedValue(null);

      const req = httpMocks.createRequest({
        body: {
          filmId: "123",
          isPremiere: true,
        },
      });

      const res = httpMocks.createResponse();

      await changePremierStatus(req, res);

      expect(res._getJSONData()).toEqual({
        success: false,
        message: "Film not found",
      });
    });

    it("should update premiere status", async () => {
      filmModelMock.findByIdAndUpdate.mockResolvedValue({
        isPremiere: true,
      });

      const req = httpMocks.createRequest({
        body: {
          filmId: "123",
          isPremiere: true,
        },
      });

      const res = httpMocks.createResponse();

      await changePremierStatus(req, res);

      expect(res._getJSONData()).toEqual({
        success: true,
        isPremiere: true,
      });
    });
  });

  describe("listAllFilms", () => {
    it("should return films list", async () => {
      filmModelMock.find.mockResolvedValue([
        { name: "Film 1" },
        { name: "Film 2" },
      ]);

      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      await listAllFilms(req, res);

      expect(res._getJSONData().success).toBe(true);
      expect(res._getJSONData().films.length).toBe(2);
    });
  });

  describe("getFilmData", () => {
    it("should return film not found", async () => {
      filmModelMock.findById.mockResolvedValue(null);

      const req = httpMocks.createRequest({
        body: { filmId: "123" },
      });

      const res = httpMocks.createResponse();

      await getFilmData(req, res);

      expect(res._getJSONData()).toEqual({
        success: false,
        message: "Film not found",
      });
    });

    it("should return film data", async () => {
      filmModelMock.findById.mockResolvedValue({
        name: "Film",
      });

      const req = httpMocks.createRequest({
        body: { filmId: "123" },
      });

      const res = httpMocks.createResponse();

      await getFilmData(req, res);

      expect(res._getJSONData().success).toBe(true);
    });
  });

  describe("listEnableFilms", () => {
    it("should return enabled films", async () => {
      filmModelMock.find.mockResolvedValue([
        { name: "Film A" },
      ]);

      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      await listEnableFilms(req, res);

      expect(res._getJSONData().success).toBe(true);
    });
  });
});