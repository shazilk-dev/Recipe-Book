const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const recipeRouter = require('./routes/recipe.routes.js')
const authRouter = require('./routes/auth.routes.js')

const app = express()

// Core middleware
app.use(morgan('dev'))
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
)
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static('public'))
app.use(cookieParser())

// Routes
app.use('/api/v1/recipes', recipeRouter)
app.use('/api/v1/auth', authRouter)

// Health check
app.get('/api/v1/health', (_req, res) => res.json({ status: 'ok' }))

// Fallback 404 for API
app.use('/api', (_req, res) => {
  res.status(404).json({ status: 'fail', message: 'Route not found' })
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  })
})

module.exports = app
