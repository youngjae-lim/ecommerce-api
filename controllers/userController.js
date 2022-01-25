import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js'

import { attachCookiesToResponse } from '../utils/index.js'

const getAllUsers = async (req, res) => {
  res.send('get all users')
}

const getSingleUser = async (req, res) => {
  res.send('get single user')
}

const showCurrentUser = async (req, res) => {
  res.send('show current user')
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
