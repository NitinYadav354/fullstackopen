import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import login from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Toggleable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [message, setMessage] = useState('')
  const blogFormRef = useRef()


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

const createBlog = async ({ title, author, url }) => {
  console.log('STEP 2: [App] Received the data package from BlogForm:', { title, author, url })
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
    blogFormRef.current?.toggleVisibility()
  } catch  {
    setMessage('Error creating blog')
    setTimeout(() => {
      setMessage('')
    }, 5000);
  }
}

const handleDelete = async (blog) => {
    const config = {
    headers: {
      Authorization: `Bearer ${token}` 
    }
  };
  if (window.confirm(`Are you sure you want to delete ${blog.title} by ${blog.author}?`)) {
      await blogService.delete(blog.id, config)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    }

}

const handleLikes = async (blog) => {

  const config = {
    headers: {
      Authorization: `Bearer ${token}` 
    }
  };
  const newBlog = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes + 1
  }
  try {
  const returnedBlog = await blogService.put(blog.id, newBlog, config)
  setBlogs(blogs.map(b => b.id === blog.id ? returnedBlog : b))
  } catch  {
    setMessage('Error liking blog')
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
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <h1>Create new blog</h1>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      
      <h2>blogs</h2>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} handleLikes={handleLikes} handleDelete={handleDelete}/>
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