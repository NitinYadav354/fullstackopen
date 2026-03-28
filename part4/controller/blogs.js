const Blog = require('../models/blog')
const BlogRouter = require('express').Router()

BlogRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
  .catch((error) => {
    console.error(error)
    response.status(500).json({ error: 'Failed to fetch blogs' })
  })
})

BlogRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
  .catch((error) => {
    console.error(error)
    response.status(500).json({ error: 'Failed to create blog' })
  })
})

module.exports = BlogRouter