import jwt from 'jsonwebtoken'

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })

  return token
}

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET)

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user })

  const oneDay = 1000 * 60 * 60 * 24 // 24 hours

  res.cookie('token', token, {
    httpOnly: true, // flags the cookie to be accessible only by the web server
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production', // marks the cookie to be used with HTTPS only
    signed: true, // indicates if the cookie should be signed
  })
}

export { createJWT, isTokenValid, attachCookiesToResponse }
