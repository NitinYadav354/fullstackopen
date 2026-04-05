import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import login from './services/login'
import Notification from './components/Notification'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [message, setMessage] = useState('')


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      setToken(user.token)
    }
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try{
      const user = await login({ username, password })
      setToken(user.token)
      setUser(user)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
    }catch{
      setMessage('Wrong credentials')
      setTimeout(() => {
        setMessage('')
      }, 5000);
    }
    console.log('logging in with', username, password)
    
}

const loginForm = () => (
  <div>
  <h2>Log in to application</h2>
  {message && <Notification message={message} />}
        <form onSubmit={handleLogin}>
                <div>
                  <label>
                    username{' '}
                    <input type="text" value={username} onChange={({target}) => setUsername(target.value)} />
                    </label>
                </div>
                <div>
                  
                    <label>
                        password{' '}
                        <input type="password" value={password} onChange={({target}) => setPassword(target.value)} />
                    </label>
                </div>
                <button type="submit">Login</button>
            </form>
  </div>
)

const createBlog = async (event) => {
  event.preventDefault()
  const title = event.target.title.value
  const author = event.target.author.value
  const url = event.target.url.value
  const config = {
    headers: {
      Authorization: `Bearer ${token}` 
    }
  };
  const newBlog = {
    title,
    author,
    url
  }
  try {
  const returnedBlog = await blogService.post(newBlog, config)
  setBlogs(blogs.concat(returnedBlog))
      setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    setTimeout(() => {
      setMessage('')
    }, 5000);
  } catch  {
    setMessage('Error creating blog')
    setTimeout(() => {
      setMessage('')
    }, 5000);
  }
}


const blogForm = () => (
     <div>
      {message && <Notification message={message} />}
      <p>{user.name} logged in</p>
      <button onClick={() => {
        setUser(null)
        window.localStorage.removeItem('loggedBlogappUser')
      }}>Logout</button>
      <br />
      <h1>Create new blog</h1>
      <form onSubmit={createBlog}>
        <div>
          <label>
            title{' '}
            <input type="text" name='title' />
          </label>
        </div>
        <div>
          <label>
            author{' '}
            <input type="text" name='author' />
          </label>
        </div>
        <div>
          <label>
            url{' '}
            <input type="text" name='url' />
          </label>
        </div>
        <button type="submit">Create</button>
      </form>
      
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
)

  if (user === null) {
    return (
      <div>
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      {blogForm()}
    </div>
  )

}

export default App