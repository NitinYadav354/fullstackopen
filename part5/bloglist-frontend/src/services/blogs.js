import axios from 'axios'
const baseUrl = 'api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const post = async (newObject, config) => {
  const request = await axios.post(baseUrl, newObject, config)
  return request.data
}

export default { getAll, post }