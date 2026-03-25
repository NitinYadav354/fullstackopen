const path = require('path')
require('dotenv').config()
const express = require('express')

const app = express()
app.use(express.static('dist'))
const Person = require('./models/person')

const morgan = require('morgan')
const cors = require('cors')

app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type',
}))

app.use(express.json())

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name == 'ValidationError'){
    return response.status(400).json({error: error.message})
  }

  next(error)
}

app.get('/api/person', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})

app.get('/api/info', (request, response) => {
  Person.find({}).then(person => {
    const output = `Phonebook has info for ${person.length} people`
    const date = new Date()
    response.send(output + '<br></br>' + date)
  })
})

app.get('/api/person/:id', (request, response) => {
  const id = request.params.id
  Person.findById(id).then(result => {
    response.json(result)
  }).catch(error => {
    console.error(error.message)
    response.status(400).send({ error: 'malformatted id' })
  })
})

app.delete('/api/person/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(result => {
      if (result) {
        response.status(204).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/person/:id', (request, response, next) => {
  const id = request.params.id
  const { name, number } = request.body

  const person = {
    name,
    number,
  }

  Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if (!updatedPerson) {
        return response.status(404).json({ error: 'person not found' })
      }

      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.post('/api/person', (request, response, next) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Name and number are required' })
  } else {

    const newPerson = {
      name: body.name,
      number: body.number
    }
    const person = new Person(newPerson)
    person.save().then(result => {
      response.status(201).json(result)
    })
    .catch(error => next(error))
  }
})


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})