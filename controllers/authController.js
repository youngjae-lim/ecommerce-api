import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnauthenticatedError } from '../errors/index.js'
import { createJWT, isTokenValid } from '../utils/index.js'

const register = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    throw new BadRequestError('please provide all values')
  }

  const emailAlreadyExists = await User.findOne({ email })
  if (emailAlreadyExists) {
    throw new BadRequestError('Email alreasy exists')
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0
  const role = isFirstAccount ? 'admin' : 'user'

  const user = await User.create({ name, email, password, role })

  const tokenUser = { name: user.name, userId: user._id, role: user.role }
  const token = createJWT({ payload: tokenUser })

  const oneDay = 1000 * 60 * 60 * 24 // 24 hours

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
  })

  res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

const login = async (req, res) => {
  res.send('login')
}

const logout = async (req, res) => {
  res.send('logout')
}

export { register, login, logout }
