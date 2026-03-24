require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')

const morgan = require('morgan')
const cors = require('cors')



app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type',
}))



// const Data = [
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

app.use(express.json())


morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/person', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})

app.get('/api/info', (request, response) => {
    const output = `Phonebook has info for ${Data.length} people`
    const date = new Date()
    response.send(output + '<br></br>' + date)
})

app.get('/api/person/:id', (request, response) => {
  const id = request.params.id
  const person = Data.find(person => person.id === id)

  if (person){
    response.json(person)
  }
  else{
    response.status(404).send('<h1>Person not found</h1>')
  }
})


app.delete('/api/person/:id', (request, response) => {
  const id = request.params.id
  const index = Data.findIndex(p => p.id === id)
  if (index !== -1) {
    Data.splice(index, 1)
    response.status(204).end()
  } else {
    response.status(404).send('<h1>Person not found</h1>')
  }
})

app.post('/api/person', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Name and number are required' })
  }
  else{
    
    const newPerson = {
      name: body.name,
      number: body.number
    }
    const person = new Person(newPerson)
    person.save().then(result => {
      response.status(201).json(result)
    })

  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})