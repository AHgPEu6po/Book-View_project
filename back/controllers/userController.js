import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import logger from "../config/logger.js";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User dosen`t exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id)
            res.json({ success: true, token })

        } else {
            return res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        if (process.env.NODE_ENV !== "test") {
            logger.error(error.message)
        }
        res.json({ success: false, message: error.message })
    }
}

const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const exists = await userModel.findOne({ email });

        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {
        if (process.env.NODE_ENV !== "test") {
            logger.error(error.message)
        }
        res.json({ success: false, message: error.message })
    }
}

const updateUser = async (req, res) => {
    try {

        const userId = req.user.id;

        const {
            name,
            birthYear,
            favoriteGenres,
            excludedGenres,
            city,
            district
        } = req.body;

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                name,
                birthYear,
                favoriteGenres,
                excludedGenres,
                city,
                district
            },
            { new: true }
        );

        res.json({
            success: true,
            user: {
                name: updatedUser.name,
                birthYear: updatedUser.birthYear,
                favoriteGenres: updatedUser.favoriteGenres,
                excludedGenres: updatedUser.excludedGenres,
                city: updatedUser.city,
                district: updatedUser.district,
                email: updatedUser.email
            }
        });

    } catch (error) {
        if (process.env.NODE_ENV !== "test") {
            logger.error(error.message)
        }
        res.json({ success: false, message: error.message });
    }
};

const getUserDate = async (req, res) => {
    try {

        const userId = req.user.id;

        const user = await userModel.findById(userId).select(
            "name birthYear favoriteGenres excludedGenres city district email"
        );

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });

    } catch (error) {
        if (process.env.NODE_ENV !== "test") {
            logger.error(error.message)
        }
        res.json({ success: false, message: error.message });
    }
};

const adminLogin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        if (process.env.NODE_ENV !== "test") {
            logger.error(error.message)
        }
        res.json({ success: false, message: error.message })
    }
}


export { loginUser, registerUser, updateUser, getUserDate, adminLogin }