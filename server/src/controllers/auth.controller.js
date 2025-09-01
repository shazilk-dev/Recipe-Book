const User = require('../models/user.model.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const signToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'devsecret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'All fields required' })
  }
  const existing = await User.findOne({ email })
  if (existing) {
    return res
      .status(409)
      .json({ status: 'fail', message: 'Email already registered' })
  }
  const user = await User.create({ name, email, password })
  const token = signToken(user)
  res.status(201).json({ status: 'success', token, data: { user } })
})

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Email and password required' })
  }
  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    return res.status(401).json({ status: 'fail', message: 'User not found' })
  }
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return res
      .status(401)
      .json({ status: 'fail', message: 'Invalid email or password' })
  }
  const safeUser = user.toObject()
  delete safeUser.password
  const token = signToken(safeUser)
  res.status(200).json({ status: 'success', token, data: { user: safeUser } })
})
