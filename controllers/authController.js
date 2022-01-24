import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnauthenticatedError } from '../errors/index.js'

const register = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    throw new BadRequestError('please provide all values')
  }

  const emailAlreadyExists = await User.findOne({ email })
  if (emailAlreadyExists) {
    throw new BadRequestError('Email alreasy exists')
  }

  const user = await User.create({ name, email, password })

  res.status(StatusCodes.CREATED).json({ user })
}

const login = async (req, res) => {
  res.send('login')
}

const logout = async (req, res) => {
  res.send('logout')
}

export { register, login, logout }
