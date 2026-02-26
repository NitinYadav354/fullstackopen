import axios from "axios";

const baseURL = "https://studies.cs.helsinki.fi/restcountries/api/"
const weatherURL = "https://api.openweathermap.org/data/2.5/weather?q="

const getAll = () => {
    const request = axios.get(baseURL+"all")
    return request
}

const getWeather = (capital) => {
    const apiKey = import.meta.env.VITE_SOME_KEY
    const request = axios.get(`${weatherURL}${capital}&appid=${apiKey}&units=metric`)
    return request
}

export default { getAll, getWeather }