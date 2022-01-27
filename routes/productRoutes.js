import express from 'express'
import {
  authenticateUser,
  authorizePermissions,
} from '../middleware/authentication.js'
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from '../controllers/productController.js'

import { getSingleProductReviews } from '../controllers/reviewController.js'

const router = express.Router()

router
  .route('/')
  .post([authenticateUser, authorizePermissions('admin')], createProduct)
  .get(getAllProducts) // open to public

router
  .route('/uploadImage')
  .post([authenticateUser, authorizePermissions('admin')], uploadImage)

router
  .route('/:id')
  .get(getSingleProduct) // open to public
  .patch([authenticateUser, authorizePermissions('admin')], updateProduct)
  .delete([authenticateUser, authorizePermissions('admin')], deleteProduct)

router.route('/:id/reviews').get(getSingleProductReviews) // open to public

export default router
