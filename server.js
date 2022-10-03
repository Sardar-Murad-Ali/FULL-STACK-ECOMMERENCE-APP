import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import morgan from 'morgan'
import fileUpload from "express-fileupload"

import {auth} from "./middleware/auth.js"

import connectDB from './db/connect.js'
import Auth from "./routes/AuthRoute.js"
import Products from "./routes/ProductRoute.js"
import Reviews from "./routes/ReviewRoute.js"
import StripeRoute from "./routes/StripeRoute.js"
import Orders from "./routes/OrderRoute.js"


import Stripe from 'stripe';



const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

import cloudinary from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});



import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'



if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(fileUpload({ useTempFiles: true }));

app.use("/api/v1/auth",Auth)
app.use("/api/v1/product",Products)
app.use("/api/v1/product/reviews",auth,Reviews)
app.use("/api/v1/product/orders",auth,Orders)
app.use("/api/v1",StripeRoute)


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port)
  } catch (error) {
    console.log(error)
  }
}

start()
