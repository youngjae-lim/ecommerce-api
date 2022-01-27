import Review from '../models/Review.js'
import Product from '../models/Product.js'
import { NotFoundError, BadRequestError } from '../errors/index.js'
import { StatusCodes } from 'http-status-codes'
import { checkPermissions } from '../utils/index.js'

const createReview = async (req, res) => {
  const { product: productId } = req.body

  const isValidProduct = await Product.findOne({ _id: productId })

  if (!isValidProduct) {
    throw new NotFoundError(`No product with id: ${productId}`)
  }

  const reviewAlreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  })

  if (reviewAlreadySubmitted) {
    throw new BadRequestError('Already submitted review for this product')
  }

  // attach userId to req.body.user
  req.body.user = req.user.userId

  // create a review
  const review = await Review.create(req.body)

  res.status(StatusCodes.CREATED).json({ review })
}

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: 'product',
    select: 'name company price',
  })

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params

  const review = await Review.findOne({ _id: reviewId })

  if (!review) {
    throw new NotFoundError(`No review with id: ${reviewId}`)
  }

  res.status(StatusCodes.OK).json({ review })
}

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params
  const { rating, title, comment } = req.body

  const review = await Review.findOne({ _id: reviewId })

  if (!review) {
    throw new NotFoundError(`No review with id: ${reviewId}`)
  }

  checkPermissions(req.user, review.user)

  review.rating = rating
  review.title = title
  review.comment = comment

  await review.save()

  res.status(StatusCodes.OK).json({ review })
}

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params

  const review = await Review.findOne({ _id: reviewId })

  if (!review) {
    throw new NotFoundError(`No review with id: ${reviewId}`)
  }

  // check if the review belongs to the user
  checkPermissions(req.user, review.user)

  await review.remove()

  res.status(StatusCodes.OK).json({ msg: 'Successfully removed review' })
}

export {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
}
