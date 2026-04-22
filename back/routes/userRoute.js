import express from 'express';
import { loginUser, registerUser, updateUser, getUserDate, adminLogin } from '../controllers/userController.js';
import authUser from '../middleware/auth.js'

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.put('/me', authUser, updateUser)
userRouter.get('/me', authUser, getUserDate)
userRouter.post('/admin', adminLogin)

export default userRouter;