const jwt = require('jsonwebtoken')

exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null
  if (!token)
    return res
      .status(401)
      .json({ status: 'fail', message: 'Not authenticated' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret')
    req.user = decoded
    next()
  } catch (e) {
    return res
      .status(401)
      .json({ status: 'fail', message: 'Invalid or expired token' })
  }
}
