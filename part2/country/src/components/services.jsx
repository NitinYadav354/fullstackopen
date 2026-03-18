import axios from "axios";

const baseURL = "https://studies.cs.helsinki.fi/restcountries/api/"
const weatherURL = "http://api.openweathermap.org/geo/1.0/direct?q="


const getAll = () => {
    const request = axios.get(baseURL+"all")
    return request
}

const getWeather = (capital) => {
    const apiKey = import.meta.env.VITE_API
    const request = axios.get(`${weatherURL}${capital}&limit=1&appid=${apiKey}`)
    const request2 = request.then(response => {
        const lat = response.data[0].lat
        const lon = response.data[0].lon
        return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    })
    return request2
}

export default { getAll, getWeather }