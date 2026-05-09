import express from 'express';
import { loginUser, registerUser, updateUser, getUserDate, adminLogin, getUserHistory } from '../controllers/userController.js';
import authUser from '../middleware/auth.js'

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.put('/me', authUser, updateUser)
userRouter.get('/me', authUser, getUserDate)
userRouter.get('/history', authUser, getUserHistory)
userRouter.post('/admin', adminLogin)

export default userRouter;