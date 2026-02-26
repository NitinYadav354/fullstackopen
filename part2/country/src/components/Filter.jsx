import { useState } from 'react'
import services from './services.jsx'

const filter = (props) => {
    if (props.search == ''){
        return null
    }

    const [i, setI] = useState(null)
    const showDetails = (i) => {
        const c = filteredCountries[i]
        if (i === null){
            return null
        }
        services.getWeather(c.capital)
        .then(response => {
        const weather = response.data
        console.log(weather)
        })  
        return (
            <div>
                <h2>{c.name.common}</h2>
                <p>Capital: {c.capital}</p>
                <p>Area: {c.area}</p>
                <h2>Languages:</h2>
                <ul>
                    {Object.values(c.languages).map(language => <li key={language}>{language}</li>)}
                </ul>
                <img src= {c.flags.png} alt= {c.flags.alt} />
                <p>Weather: {weather?.weather?.[0]?.description || 'No weather data available'}</p>
                </div>
        )
    }

    const filteredCountries = props.countries.filter(country => country.name.common.toLowerCase().includes(props.search.toLowerCase()))
    if (filteredCountries.length > 10){
        return <div className="filter">Too many matches, specify another filter</div>
    }
    if (filteredCountries.length === 1){
        return (
            showDetails(0)
        )
    }
    else{
    return <div className="filter">
        <ul>
        {filteredCountries.map((country, i) => (
          <li key={country.cca3}>{country.name.common} <button onClick={() => setI(i)}>show </button></li>
        ))}
      </ul>
        {showDetails(i)}
    </div>
    }
}

export default filter