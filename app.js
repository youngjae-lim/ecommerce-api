import express from 'express'
import connectDB from './db/connect.js'
import dotenv from 'dotenv'
import 'express-async-errors'

// middleware
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'

dotenv.config()
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('e-commerce api')
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

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
