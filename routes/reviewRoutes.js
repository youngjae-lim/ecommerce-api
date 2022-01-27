import express from 'express'
import { authenticateUser } from '../middleware/authentication.js'
import {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js'

const router = express.Router()

router.route('/').post(authenticateUser, createReview).get(getAllReviews) // getAllReview open to public

router
  .route('/:id')
  .get(getSingleReview) // open to public
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview)

export default router
