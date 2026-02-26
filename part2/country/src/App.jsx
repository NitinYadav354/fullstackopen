import { useState, useEffect } from 'react'
import services from './components/services.jsx'  
import Search from './components/search.jsx'
import Filter from './components/filter.jsx'


function App() {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    services.getAll()
    .then(response => setCountries(response.data))
  }, [])

  const searchHandler = (event) => {
    setSearch(event.target.value)
  }

  return (
    <div>
      <h1>Country Search</h1>
      <Search search={search} handleSearch={searchHandler} />
      <Filter countries={countries} search={search} />
    </div>
  )
}

export default App
