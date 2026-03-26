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

  const getApiErrorMessage = (error, fallbackMessage) => {
    const apiError = error?.response?.data?.error
    const genericMessage = error?.message

    if (apiError) {
      return apiError
    }

    if (genericMessage) {
      return genericMessage
    }

    return fallbackMessage
  }

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
      const updatedPerson = { ...personToUpdate, number: newNumber }
      services.updateNotes(personToUpdate.id, updatedPerson)
        .then(response => {
          setPersons(persons.map(person => person.id !== personToUpdate.id ? person : response.data))
          setNotification({ message: `Updated ${newName}`, type: 'success' })
          setNewName('')
          setNewNumber('')
          setTimeout(() => setNotification(null), 5000)
        })
        .catch(error => {
          if (error?.response?.status === 404) {
            setNotification({ message: `Information of ${newName} has already been removed from server`, type: 'error' })
            setPersons(persons.filter(p => p.id !== personToUpdate.id))
          } else if (error?.response?.status === 400) {
            setNotification({ message: `Validation error: ${getApiErrorMessage(error, 'Request validation failed')}`, type: 'error' })
          } else {
            setNotification({ message: `Failed to update ${newName}: ${getApiErrorMessage(error, 'Unknown server error')}`, type: 'error' })
          }

          setTimeout(() => setNotification(null), 5000)
        })
      return
    }
    
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
      .catch(error => {
        if (error?.response?.status === 400) {
          setNotification({ message: `Validation error: ${getApiErrorMessage(error, 'Request validation failed')}`, type: 'error' })
        } else {
          setNotification({ message: `Failed to add ${newName}: ${getApiErrorMessage(error, 'Unknown server error')}`, type: 'error' })
        }

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

