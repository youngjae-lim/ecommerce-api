import express from 'express'
import connectDB from './db/connect.js'
import dotenv from 'dotenv'
import 'express-async-errors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'

// security
import cors from 'cors'
import rateLimiter from 'express-rate-limit'
import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'

// routers
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'
import productRouter from './routes/productRoutes.js'
import reviewRouter from './routes/reviewRoutes.js'
import orderRouter from './routes/orderRoutes.js'

// middleware
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'

dotenv.config()
const app = express()

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev')) // logger middleware for HTTP request
}

// security packages
app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 60, // up to 60 requests
  })
)
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())

// parse incoming requests with JSON payloads
app.use(express.json())

// make cookie accessible in the client
app.use(cookieParser(process.env.JWT_SECRET))

// make /public directory static
app.use(express.static('./public'))
app.use(fileUpload())

// routers
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/orders', orderRouter)

// middleware
app.use(notFoundMiddleware) // 404 error before erorrHandler middleware. The order matters!
app.use(errorHandlerMiddleware) // handles errors from the existing routes only

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
