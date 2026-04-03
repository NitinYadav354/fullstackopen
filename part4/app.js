const express = require('express')
const app = express()
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const BlogRouter = require('./controller/blogs')
const middleware = require('./utils/middleware')
const userRouter = require('./controller/users')
const loginRouter = require('./controller/login')
const MONGODB_URI = config.MONGODB_URI


mongoose.connect(MONGODB_URI, { family: 4 }).then(() => {
  logger.logger('connected to MongoDB')
}).catch((error) => {
  logger.errorLogger('error connecting to MongoDB:', error.message)
})


app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/users', userRouter)
app.use('/api/blogs', BlogRouter)
app.use('/api/login', loginRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app



