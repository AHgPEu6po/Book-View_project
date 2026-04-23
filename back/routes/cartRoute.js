import expres from 'express'
import { addToCart, deleteFromCart, getUserCart } from '../controllers/cartController.js'
import authUser from '../middleware/auth.js'

const cartRouter = expres.Router()

cartRouter.post('/get', authUser, getUserCart)
cartRouter.post('/add', authUser, addToCart)
cartRouter.post("/delete", authUser, deleteFromCart);

export default cartRouter