import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import logger from "../config/logger.js";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

const loginUser = async (req, res) => {

}

const registerUser = async (req, res) => {

}

const adminLogin = async (req, res) => {

}

export { loginUser, registerUser, adminLogin }