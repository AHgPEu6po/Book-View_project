import { jest } from "@jest/globals";
import httpMocks from "node-mocks-http";

const cinemaModelMock = {
  find: jest.fn(),
  findById: jest.fn(),
};

const cloudinaryMock = {
  uploader: {
    upload: jest.fn(),
  },
};

jest.unstable_mockModule("../models/cinemaModel.js", () => ({
  default: cinemaModelMock,
}));

jest.unstable_mockModule("cloudinary", () => ({
  v2: cloudinaryMock,
}));

jest.unstable_mockModule("../config/logger.js", () => ({
  default: {
    error: jest.fn(),
  },
}));

const { createCinema, listAllCinemas, getCinemaData, listNamesOfCinemas } = await import("../controllers/cinemaController.js");

describe("Cinema Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createCinema", () => {
    it("should return error if required fields missing", async () => {
      const req = httpMocks.createRequest({
        body: {},
        file: null,
      });

      const res = httpMocks.createResponse();

      await createCinema(req, res);

      expect(res._getJSONData()).toEqual({
        success: false,
        message: "Missing required fields",
      });
    });
  });

  describe("listAllCinemas", () => {
    it("should return all cinemas", async () => {
      cinemaModelMock.find.mockResolvedValue([
        { name: "Cinema 1" },
        { name: "Cinema 2" },
      ]);

      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      await listAllCinemas(req, res);

      const data = res._getJSONData();

      expect(data.success).toBe(true);
      expect(data.cinemas.length).toBe(2);
    });
  });

  describe("getCinemaData", () => {
    it("should return cinema not found", async () => {
      cinemaModelMock.findById.mockResolvedValue(null);

      const req = httpMocks.createRequest({
        body: { cinemaId: "123" },
      });

      const res = httpMocks.createResponse();

      await getCinemaData(req, res);

      expect(res._getJSONData()).toEqual({
        success: false,
        message: "Cinema not found",
      });
    });

    it("should return cinema data", async () => {
      cinemaModelMock.findById.mockResolvedValue({
        name: "Cinema 1",
      });

      const req = httpMocks.createRequest({
        body: { cinemaId: "123" },
      });

      const res = httpMocks.createResponse();

      await getCinemaData(req, res);

      const data = res._getJSONData();

      expect(data.success).toBe(true);
      expect(data.cinema).toBeDefined();
    });
  });

  describe("listNamesOfCinemas", () => {
    it("should return cinema names only", async () => {
      cinemaModelMock.find.mockReturnValue({
        select: jest.fn().mockResolvedValue([
          { _id: "1", name: "Cinema A" },
        ]),
      });

      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      await listNamesOfCinemas(req, res);

      const data = res._getJSONData();

      expect(data.success).toBe(true);
      expect(data.cinemas[0].name).toBe("Cinema A");
    });
  });
});