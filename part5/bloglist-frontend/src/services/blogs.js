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

const put = async (id, updatedObject, config) => {
  const request = await axios.put(`${baseUrl}/${id}`, updatedObject, config)
  return request.data
}

const deleteBlog = async (id, config) => {
  await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, post, put, delete: deleteBlog }