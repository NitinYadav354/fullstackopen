const {test, expect} = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const Blog = require('../models/blog')
const mongoose = require('mongoose')

test('creating a new user', async () => {
    await User.deleteMany({})
    const newUser = {
        username: 'testuser',
        name: 'Test User',
        password: 'password123'
    }
    const response = await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.username, newUser.username)
    assert.strictEqual(response.body.name, newUser.name)
    assert.strictEqual(response.body.passwordHash, undefined)
})

test('creating a user with short password', async () => {
    const newUser = {
        username: 'shortpass',
        name: 'Short Pass',
        password: 'pw'
    }
    const response = await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.error, 'Password must be at least 3 characters long')
})

test('creating a user with duplicate username', async () => {
    const newUser = {
        username: 'testuser',
        name: 'Duplicate User',
        password: 'password123'
    }
    const response = await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.error, 'Username must be unique')
})

test('listing users displays blogs created by each user', async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const newUser = {
        username: 'blogowner',
        name: 'Blog Owner',
        password: 'securepass'
    }

    await api.post('/api/users').send(newUser).expect(201)

    const usersAtStart = await api.get('/api/users').expect(200)
    const createdUser = usersAtStart.body.find(user => user.username === newUser.username)

    const newBlog = {
        title: 'User specific blog',
        author: 'Blog Owner',
        url: 'https://example.com/user-blog',
        likes: 3,
        user: {
            id: createdUser.id,
            username: createdUser.username,
            name: createdUser.name
        }
    }

    await api.post('/api/blogs').send(newBlog).expect(201)

    const usersAtEnd = await api.get('/api/users').expect(200)
    const blogOwner = usersAtEnd.body.find(user => user.username === newUser.username)

    assert.ok(blogOwner)
    assert.ok(Array.isArray(blogOwner.blogs))
    assert.strictEqual(blogOwner.blogs.length, 1)
    assert.strictEqual(blogOwner.blogs[0].title, newBlog.title)
})