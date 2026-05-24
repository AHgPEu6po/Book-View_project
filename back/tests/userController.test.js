import { jest } from "@jest/globals";
import httpMocks from "node-mocks-http";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userModelMock = {
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn()
};

jest.unstable_mockModule("../models/userModel.js", () => ({
    default: userModelMock
}));

process.env.JWT_SECRET = "test-secret";
process.env.ADMIN_EMAIL = "admin@test.com";
process.env.ADMIN_PASSWORD = "123456";

const {
    loginUser,
    registerUser,
    updateUser,
    getUserDate,
    adminLogin,
    getUserHistory,
    rateFilm
} = await import("../controllers/userController.js");

describe("User Controller", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("loginUser", () => {

        it("should return error if user does not exist", async () => {

            userModelMock.findOne.mockResolvedValue(null);

            const req = httpMocks.createRequest({
                body: {
                    email: "test@test.com",
                    password: "12345678"
                }
            });

            const res = httpMocks.createResponse();

            await loginUser(req, res);

            expect(res._getJSONData()).toEqual({
                success: false,
                message: "User dosen`t exists"
            });

        });

        it("should login user successfully", async () => {

            const mockUser = {
                _id: "12345",
                email: "test@test.com",
                password: "hashed-password"
            };

            userModelMock.findOne.mockResolvedValue(mockUser);

            jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
            jest.spyOn(jwt, "sign").mockReturnValue("mock-token");

            const req = httpMocks.createRequest({
                body: {
                    email: "test@test.com",
                    password: "12345678"
                }
            });

            const res = httpMocks.createResponse();

            await loginUser(req, res);

            expect(res._getJSONData()).toEqual({
                success: true,
                token: "mock-token"
            });

        });

        it("should return invalid credentials", async () => {

            const mockUser = {
                password: "hashed-password"
            };

            userModelMock.findOne.mockResolvedValue(mockUser);

            jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

            const req = httpMocks.createRequest({
                body: {
                    email: "test@test.com",
                    password: "wrong-password"
                }
            });

            const res = httpMocks.createResponse();

            await loginUser(req, res);

            expect(res._getJSONData()).toEqual({
                success: false,
                message: "Invalid credentials"
            });

        });

    });

    describe("registerUser", () => {

        it("should return error if user already exists", async () => {

            userModelMock.findOne.mockResolvedValue({ email: "test@test.com" });

            const req = httpMocks.createRequest({
                body: {
                    name: "Test",
                    email: "test@test.com",
                    password: "12345678"
                }
            });

            const res = httpMocks.createResponse();

            await registerUser(req, res);

            expect(res._getJSONData()).toEqual({
                success: false,
                message: "User already exists"
            });

        });

        it("should return invalid email error", async () => {

            userModelMock.findOne.mockResolvedValue(null);

            const req = httpMocks.createRequest({
                body: {
                    name: "Test",
                    email: "invalid-email",
                    password: "12345678"
                }
            });

            const res = httpMocks.createResponse();

            await registerUser(req, res);

            expect(res._getJSONData()).toEqual({
                success: false,
                message: "Please enter a valid email"
            });

        });
    });

    describe("updateUser", () => {

        it("should update user successfully", async () => {

            const updatedUser = {
                name: "Updated",
                birthYear: 2000,
                favoriteGenres: ["Action"],
                excludedGenres: ["Horror"],
                city: "Kyiv",
                district: "Center",
                email: "test@test.com"
            };

            userModelMock.findByIdAndUpdate.mockResolvedValue(updatedUser);

            const req = httpMocks.createRequest({
                user: {
                    id: "12345"
                },
                body: updatedUser
            });

            const res = httpMocks.createResponse();

            await updateUser(req, res);

            expect(res._getJSONData()).toEqual({
                success: true,
                user: updatedUser
            });

        });

    });

    describe("getUserDate", () => {

        it("should return user data", async () => {

            const mockUser = {
                name: "Test"
            };

            userModelMock.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            const req = httpMocks.createRequest({
                user: {
                    id: "12345"
                }
            });

            const res = httpMocks.createResponse();

            await getUserDate(req, res);

            expect(res._getJSONData()).toEqual({
                success: true,
                user: mockUser
            });

        });

        it("should return user not found", async () => {

            userModelMock.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            });

            const req = httpMocks.createRequest({
                user: {
                    id: "12345"
                }
            });

            const res = httpMocks.createResponse();

            await getUserDate(req, res);

            expect(res._getJSONData()).toEqual({
                success: false,
                message: "User not found"
            });

        });

    });

    describe("adminLogin", () => {

        it("should login admin successfully", async () => {

            jest.spyOn(jwt, "sign").mockReturnValue("admin-token");

            const req = httpMocks.createRequest({
                body: {
                    email: "admin@test.com",
                    password: "123456"
                }
            });

            const res = httpMocks.createResponse();

            await adminLogin(req, res);

            expect(res._getJSONData()).toEqual({
                success: true,
                token: "admin-token"
            });

        });

        it("should return invalid credentials", async () => {

            const req = httpMocks.createRequest({
                body: {
                    email: "wrong@test.com",
                    password: "wrong"
                }
            });

            const res = httpMocks.createResponse();

            await adminLogin(req, res);

            expect(res._getJSONData()).toEqual({
                success: false,
                message: "Invalid credentials"
            });

        });

    });

    describe("getUserHistory", () => {

        it("should return user history", async () => {

            const mockUser = {
                history: []
            };

            userModelMock.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            const req = httpMocks.createRequest({
                user: {
                    id: "12345"
                }
            });

            const res = httpMocks.createResponse();

            await getUserHistory(req, res);

            expect(res._getJSONData()).toEqual({
                success: true,
                user: mockUser
            });

        });

    });

    describe("rateFilm", () => {

        it("should return invalid rating error", async () => {

            const req = httpMocks.createRequest({
                user: {
                    id: "12345"
                },
                body: {
                    rating: 11
                }
            });

            const res = httpMocks.createResponse();

            await rateFilm(req, res);

            expect(res._getJSONData()).toEqual({
                success: false,
                message: "Rating must be from 1 to 10"
            });

        });

        it("should add rating successfully", async () => {

            const saveMock = jest.fn();

            const mockUser = {
                history: [
                    {
                        film_id: {
                            toString: () => "film123"
                        },
                        sessionDate: "2025-01-01",
                        rating: null
                    }
                ],
                save: saveMock
            };

            userModelMock.findById.mockResolvedValue(mockUser);

            const req = httpMocks.createRequest({
                user: {
                    id: "12345"
                },
                body: {
                    filmId: "film123",
                    sessionDate: "2025-01-01",
                    rating: 8
                }
            });

            const res = httpMocks.createResponse();

            await rateFilm(req, res);

            expect(res._getJSONData()).toEqual({
                success: true,
                message: "Rating added"
            });
        });
    });
});