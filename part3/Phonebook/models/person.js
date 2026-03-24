const mongoose = require('mongoose')
require('dotenv').config()

const passwordArg = process.argv[2] 
const rawMongoUri = process.env.MONGODB_URI || ''

const url = rawMongoUri.includes('${password}')
  ? rawMongoUri.replace('${password}', encodeURIComponent(passwordArg || ''))
  : rawMongoUri

if (!url || url.includes('${password}')) {
  throw new Error('Invalid MONGODB_URI. Provide a full URI or pass password with: npm run dev -- <password>')
}

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 }).catch((error) => {
  console.error('Failed to connect to MongoDB:', error.message)
  process.exit(1)
})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
