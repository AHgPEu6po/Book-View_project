import express from 'express'
import cors from 'cors'
import mongoose from "mongoose"

import cartRouter from "./routes/cartRoute.js"
import cinemaRouter from "./routes/cinemaRoute.js"
import filmRouter from "./routes/filmRoute.js"
import orderRouter from "./routes/orderRoute.js"
import roomRouter from "./routes/roomRoute.js"
import sessionListRouter from "./routes/sessionListRoute.js"
import sessionRouter from "./routes/sessionRoute.js"
import userRouter from "./routes/userRoute.js"

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/user', userRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/film', filmRouter)
app.use('/api/cinema', cinemaRouter)
app.use('/api/room', roomRouter)
app.use('/api/sessionList', sessionListRouter)
app.use('/api/session', sessionRouter)

app.get('/health', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping()

    return res.status(200).json({
      status: "OK",
      db: "connected"
    })
  } catch {
    return res.status(503).json({
      status: "ERROR",
      db: "disconnected"
    })
  }
})

app.get('/', (req, res) => {
  res.send("API Working")
})

export default app