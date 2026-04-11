import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
					title{' '}
          <input type="text" name="title" value={title} onChange={({ target }) => setTitle(target.value)} />
        </label>
      </div>
      <div>
        <label>
					author{' '}
          <input type="text" name="author" value={author} onChange={({ target }) => setAuthor(target.value)} />
        </label>
      </div>
      <div>
        <label>
					url{' '}
          <input type="text" name="url" value={url} onChange={({ target }) => setUrl(target.value)} />
        </label>
      </div>
      <button type="submit">Create</button>
    </form>
  )
}

export default BlogForm
