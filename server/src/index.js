require('dotenv').config({ path: './.env' })
const connectDB = require('./db/index.js')
const app = require('./app.js')

const PORT = process.env.PORT || 4000

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at PORT: ${PORT}`)
    })
  })
  .catch((err) => {
    console.log('MONGO DB connection FAILED !!!', err)
  })
