const User = require('../models/user')
const bcrypt = require('bcrypt')
const UserRouter = require('express').Router()

UserRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {
        title: 1,
        author: 1,
        url: 1,
        likes: 1
    })
    response.json(users)
})

UserRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (!password || password.length < 3) {
        return response.status(400).json({ error: 'Password must be at least 3 characters long' })
    }
    if (!username || username.length < 3) {
        return response.status(400).json({ error: 'Username must be at least 3 characters long' })
    }


    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    try{
    
    const savedUser = await user.save()
    response.status(201).json(savedUser)
    } catch (error) {
        if (error.name === 'ValidationError') {
            return response.status(400).json({ error: error.message })
        }
        if (error.code === 11000) {
            return response.status(400).json({ error: 'Username must be unique' })
        }
    }


})


module.exports = UserRouter
