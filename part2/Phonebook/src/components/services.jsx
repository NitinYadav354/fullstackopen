import axios from "axios";

const base_url = 'http://localhost:3001/persons'

const getALL = () => {
    const request = axios.get(base_url)
    return request
}


const addNotes = (data) => {
    const request = axios.post(base_url, data)
    return request
}

const updateNotes = (id, data) => {
    const request = axios.patch( `${base_url}/${id}`, data)
    return request

}

const deleteNotes = (id) => {
    const request = axios.delete(`${base_url}/${id}`)
    return request
}

export default {
    getALL,
    updateNotes,
    addNotes,
    deleteNotes
}