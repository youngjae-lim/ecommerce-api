import Product from '../models/Product.js'
import { StatusCodes } from 'http-status-codes'
import { NotFoundError, BadRequestError } from '../errors/index.js'
import path from 'path'

const createProduct = async (req, res) => {
  // note that cookie attaches userId via middleware which made it available to use here
  req.body.user = req.user.userId
  const product = await Product.create(req.body)
  res.status(StatusCodes.CREATED).json({ product })
}

const getAllProducts = async (req, res) => {
  res.send('get all products')
}

const getSingleProduct = async (req, res) => {
  res.send('get single product')
}

const updateProduct = async (req, res) => {
  res.send('update product')
}

const deleteProduct = async (req, res) => {
  res.send('delete product')
}

const uploadImage = async (req, res) => {
  res.send('upload image')
}

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
}
