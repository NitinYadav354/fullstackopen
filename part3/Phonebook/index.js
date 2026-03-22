const express = require('express')
const app = express()

const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

const Data = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())


morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/person', (request, response) => {
    response.json(Data)
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
      id: Math.floor(Math.random() * 1000000).toString(),
      name: body.name,
      number: body.number
    }
    if (Data.find(p => p.name.toLowerCase() === newPerson.name.toLowerCase())) {
      return response.status(400).json({ error: 'Name must be unique' })
    }
    Data.push(newPerson)
    response.status(201).json(newPerson)

  }
})

app.listen(3001, () => {
    console.log('Server is running on port 3001')
})