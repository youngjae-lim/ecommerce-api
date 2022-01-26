import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js'

import { attachCookiesToResponse } from '../utils/index.js'

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password')
  res.status(StatusCodes.OK).json({ users })
}

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select('-password')
  if (!user) {
    throw new NotFoundError(`No user with id: ${req.params.id}`)
  }
  res.status(StatusCodes.OK).json({ user })
}

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user })
}

const updateUser = async (req, res) => {
  res.send('update user')
}

const updateUserPassword = async (req, res) => {
  res.send('update password')
}

export {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
}
