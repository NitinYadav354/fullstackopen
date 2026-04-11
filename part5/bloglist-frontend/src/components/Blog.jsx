import { useState } from 'react'
const Blog = ({ blog, handleLikes, handleDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [visible, setVisible] = useState(false)
  return (
    <div style={blogStyle} className='blog'>
      <h1>{blog.title}</h1>
      {!visible && <p>by {blog.author}</p>}
      <button onClick={() => setVisible(!visible)}>
        {visible ? 'hide' : 'view'}
      </button>
      {visible && (
        <div>
          <p><a href={blog.url}>
            {blog.url}
          </a></p>
          <p>{blog.likes} likes <button onClick={() => handleLikes(blog)}>like</button></p>
          <p>{blog.author}</p>
          <button onClick={() => handleDelete(blog)}>Remove</button>
        </div>
      )}

    </div>  
  )
}

export default Blog