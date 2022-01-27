import Product from '../models/Product.js'
import { StatusCodes } from 'http-status-codes'
import { NotFoundError, BadRequestError } from '../errors/index.js'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const createProduct = async (req, res) => {
  // note that cookie attaches userId via middleware which made it available to use here
  req.body.user = req.user.userId
  const product = await Product.create(req.body)
  res.status(StatusCodes.CREATED).json({ product })
}

const getAllProducts = async (req, res) => {
  const products = await Product.find({})
  res.status(StatusCodes.OK).json({ products, count: products.length })
}

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params

  const product = await Product.findOne({ _id: productId }).populate('reviews')

  if (!product) {
    throw new NotFoundError(`No product with id: ${productId}`)
  }

  res.status(StatusCodes.OK).json({ product })
}

const updateProduct = async (req, res) => {
  const { id: productId } = req.params

  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  })

  if (!product) {
    throw new NotFoundError(`No product with id: ${productId}`)
  }

  res.status(StatusCodes.OK).json({ product })
}

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params

  const product = await Product.findOne({ _id: productId })

  if (!product) {
    throw new NotFoundError(`No product with id: ${productId}`)
  }

  await product.remove() // will trigger the hook that deletes all associated reviews

  res.status(StatusCodes.OK).json({ msg: 'Success! Product removded!' })
}

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError('No File Uploaded')
  }

  const productImage = req.files.image

  if (!productImage.mimetype.startsWith('image')) {
    throw new BadRequestError('Please upload image')
  }

  const maxSize = 1024 * 1024

  if (productImage.size > maxSize) {
    throw new BadRequestError('Please upload image smaller than 1MB')
  }

  // get the current directory - root directory of the project
  const __dirname = dirname(fileURLToPath(import.meta.url))

  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${productImage.name}`
  )

  await productImage.mv(imagePath)
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` })
}

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
}
