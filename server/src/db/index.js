const mongoose = require('mongoose')
const { DB_NAME } = require('../contants.js')

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
    const connectionInstance = await mongoose.connect(`${uri}/${DB_NAME}`)
    console.log(
      `MongoDB connected. Host: ${connectionInstance.connection.host}`
    )
  } catch (error) {
    console.log('MONGODB connection FAILED ', error)
    process.exit(1)
  }
}

module.exports = connectDB
