import express from 'express'
import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from '../controllers/userController.js'
import { authenticateUser } from '../middleware/authentication.js'

const router = express.Router()

router.route('/').get(authenticateUser, getAllUsers)
router.route('/showMe').get(showCurrentUser)
router.route('/updateUser').patch(updateUser)
router.route('/updateUserPassword').patch(updateUserPassword)
router.route('/:id').get(authenticateUser, getSingleUser) // must be on the bottom of route lists

export default router
