import logger from "../config/logger.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'

const currency = "uah"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const placeOrderStripe = async (req, res) => {

}

const verifyStripe = async (req, res) => {

}


const userOrders = async (req, res) => {
    
}

export { placeOrderStripe, userOrders, verifyStripe }