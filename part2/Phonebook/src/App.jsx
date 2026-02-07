import { useState } from 'react'
import Filter from './components/Filter.jsx'
import ShowPerson from './components/ShowPerson.jsx'
import AddPerson from './components/AddPerson.jsx'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    setPersons(persons.concat({ name: newName, number: newNumber }))
    setNewName('')
    setNewNumber('')
  }



  return (
    <div>
      <h1>Filter shown with</h1>
      <Filter search={search} handleSearchChange={handleSearchChange} />
      <h2>Phonebook</h2>
      <AddPerson newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} handleSubmit={handleSubmit} />
      <h2>Numbers</h2>
      <ShowPerson persons={persons} search={search} />
    </div>

  )
}

export default App

