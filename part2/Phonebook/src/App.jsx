import { useState, useEffect } from 'react'
import Filter from './components/Filter.jsx'
import ShowPerson from './components/ShowPerson.jsx'
import AddPerson from './components/AddPerson.jsx'
import services from './components/services.jsx'
import Notification from './components/Notification.jsx'

const App = () => {

  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    services.getALL()
      .then(response => setPersons(response.data))
  }, [])

  const handleDelete = (id) => {
    if (window.confirm('Delete this entry?')) {
      services.deleteNotes(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

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
      const personToUpdate = persons.find(person => person.name === newName)
      services.updateNotes(personToUpdate.id, { number: newNumber })
        .then(response => {
          setPersons(persons.map(person => person.id !== personToUpdate.id ? person : response.data))
          setNotification({ message: `Updated ${newName}`, type: 'success' })
          setNewName('')
          setNewNumber('')
          setTimeout(() => setNotification(null), 5000)
        })
        .catch(error => {
          setNotification({ message: `Information of ${newName} has already been removed from server`, type: 'error' })
          setPersons(persons.filter(p => p.id !== personToUpdate.id))
          setTimeout(() => setNotification(null), 5000)
        })
      return
    }
    
    const newPerson = { name: newName, number: newNumber }
    
    services.addNotes({
      name: newName,
      number: newNumber
    })
      .then(response => {
        setPersons(persons.concat(response.data))
        setNotification({ message: `Added ${newName}`, type: 'success' })
        setNewName('')
        setNewNumber('')
        setTimeout(() => setNotification(null), 5000)
      })
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification notification={notification} />
      <h1>Filter shown with</h1>
      <Filter search={search} handleSearchChange={handleSearchChange} />
      <h2>Phonebook</h2>
      <AddPerson newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} handleSubmit={handleSubmit} />
      <h2>Numbers</h2>
      <ShowPerson persons={persons} search={search} handleDelete={handleDelete} />
    </div>
  )
}

export default App

