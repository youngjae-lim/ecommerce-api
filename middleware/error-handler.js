import { StatusCodes } from 'http-status-codes'

const errorHandlerMiddleware = (err, req, res, next) => {
  let defaultError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  }

  if (err.name === 'ValidationError') {
    defaultError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')
    defaultError.statusCode = 400
  }

  if (err.code && err.code === 11000) {
    defaultError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`
    defaultError.statusCode = 400
  }

  if (err.name === 'CastError') {
    defaultError.msg = `No item found with id : ${err.value}`
    defaultError.statusCode = 404
  }

  return res.status(defaultError.statusCode).json({ msg: defaultError.msg })
}

export default errorHandlerMiddleware
