import express from 'express'
import connectDB from './db/connect.js'
import dotenv from 'dotenv'
import 'express-async-errors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

// routes
import authRouter from './routes/authRoutes.js'

// middleware
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'

dotenv.config()
const app = express()

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev')) // logger middleware for HTTP request
}

// parse incoming requests with JSON payloads
app.use(express.json())

// make cookie accessible in the client
app.use(cookieParser())

app.use('/api/v1/auth', authRouter)

app.get('/', (req, res) => {
  res.send('e-commerce api')
})

app.get('/api/v1', (req, res) => {
  console.log(req.cookies)
  res.send('e-commerce api')
})

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
