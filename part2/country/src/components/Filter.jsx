import { useEffect, useState } from 'react'
import services from './services.jsx'

const Filter = (props) => {
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [weather, setWeather] = useState(null)

    const filteredCountries = props.countries.filter((country) =>
        country.name.common.toLowerCase().includes(props.search.toLowerCase())
    )

    const selectedCountry = filteredCountries.length === 1
        ? filteredCountries[0]
        : selectedIndex !== null
            ? filteredCountries[selectedIndex]
            : null

    useEffect(() => {
        if (selectedIndex !== null && selectedIndex >= filteredCountries.length) {
            setSelectedIndex(null)
        }
    }, [filteredCountries.length, selectedIndex])

    useEffect(() => {
        setWeather(null)

        if (!selectedCountry) {
            return
        }

        const capital = Array.isArray(selectedCountry.capital)
            ? selectedCountry.capital[0]
            : selectedCountry.capital

        if (!capital) {
            return
        }

        services.getWeather(capital, selectedCountry.cca2)
            .then((response) => {
                setWeather(response.data)
            })
            .catch(() => {
                setWeather(null)
            })
    }, [selectedCountry])

    const showDetails = (country) => {
        if (!country) {
            return null
        }

        return (
            <div>
                <h2>{country.name.common}</h2>
                <p>Capital: {Array.isArray(country.capital) ? country.capital.join(', ') : country.capital}</p>
                <p>Area: {country.area}</p>
                <h2>Languages:</h2>
                <ul>
                    {Object.values(country.languages || {}).map((language) => <li key={language}>{language}</li>)}
                </ul>
                <img src={country.flags.png} alt={country.flags.alt || `${country.name.common} flag`} />
                <h1>Weather in {Array.isArray(country.capital) ? country.capital[0] : country.capital}</h1>
                <p>Temperature: {weather?.main?.temp || 'No weather data available'} celcius</p>
                <p>Wind Speed: {weather?.wind?.speed || 'No weather data available'} m/s</p>
            </div>
        )
    }

    if (props.search === '') {
        return null
    }

    if (filteredCountries.length > 10) {
        return <div className="filter">Too many matches, specify another filter</div>
    }

    if (filteredCountries.length === 1) {
        return showDetails(filteredCountries[0])
    }

    return (
        <div className="filter">
            <ul>
                {filteredCountries.map((country, index) => (
                    <li key={country.cca3}>
                        {country.name.common} <button onClick={() => setSelectedIndex(index)}>show</button>
                    </li>
                ))}
            </ul>
            {showDetails(selectedCountry)}
        </div>
    )
}

export default Filter