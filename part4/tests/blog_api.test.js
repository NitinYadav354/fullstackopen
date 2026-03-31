const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'First test blog',
    author: 'Tester One',
    url: 'https://example.com/1',
    likes: 1,
  },
  {
    title: 'Second test blog',
    author: 'Tester Two',
    url: 'https://example.com/2',
    likes: 2,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('blog unique identifier property is named id', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)

  const blog = response.body[0]
  assert.ok(blog.id)
  assert.strictEqual(blog._id, undefined)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New test blog',
    author: 'Tester Three',
    url: 'https://example.com/3',
    likes: 8,
  }
  

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length + 1)

  const titles = response.body.map(r => r.title)
  console.log(titles)
  assert.ok(titles.includes(newBlog.title))
})

test('if likes property is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Tester Four',
    url: 'https://example.com/4',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const addedBlog = response.body.find(b => b.title === newBlog.title)
  assert.strictEqual(addedBlog.likes, 0)
})

describe(' if the title or url properties are missing from the request data', () => {
test(' if the title properties are missing from the request data', async () => {
  const newBlog = {
    author: 'Tester Five',
    url: 'https://example.com/5',
    likes: 4
  }
  
  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(400)
})
test(' if the url properties are missing from the request data', async () => {
  const newBlog = {
    title: 'Blog without url',
    author: 'Tester Six',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)  

})
})

test.only('a blog can be deleted', async () => {
  const response = await api.get('/api/blogs')
  const blogToDelete = response.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const updatedResponse = await api.get('/api/blogs')
  assert.strictEqual(updatedResponse.body.length, initialBlogs.length - 1)
})

test.only('a blog can be updated', async () => {
  const response = await api.get('/api/blogs')
  const blogToUpdate = response.body[0]

  const updatedBlog = {
    ...blogToUpdate,
    likes: 10
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)

  const updatedResponse = await api.get('/api/blogs')
  const updatedBlogInDb = updatedResponse.body.find(b => b.id === blogToUpdate.id)
  assert.strictEqual(updatedBlogInDb.likes, updatedBlog.likes)
})


after(async () => {
  await mongoose.connection.close()
})