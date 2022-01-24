import express from 'express'
import connectDB from './db/connect.js'
import dotenv from 'dotenv'
import 'express-async-errors'
import morgan from 'morgan'

// middleware
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'

dotenv.config()
const app = express()

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev')) // logger middleware for HTTP request
}

app.use(express.json())

app.get('/', (req, res) => {
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
