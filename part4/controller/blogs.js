const Blog = require('../models/blog')
const BlogRouter = require('express').Router()

BlogRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Failed to fetch blogs' })
  }
})

BlogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  try {
    const result = await blog.save()
    response.status(201).json(result)
  } catch (error) {
    console.error(error)
    if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
    response.status(500).json({ error: 'Failed to create blog' })
  }
})

BlogRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Failed to delete blog' })
  }
})

BlogRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { title, author, url, likes },
    )
    response.json(updatedBlog)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Failed to update blog' })
  }
})

module.exports = BlogRouter