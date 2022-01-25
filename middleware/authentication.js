import { UnauthenticatedError } from '../errors/index.js'
import { isTokenValid } from '../utils/index.js'

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token

  if (!token) {
    throw new UnauthenticatedError('Authentication Invalid')
  }

  try {
    const { name, userId, role } = isTokenValid({ token })
    // attach user object to reqeust
    req.user = { name, userId, role }
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication Invalid')
  }
}

export { authenticateUser }
