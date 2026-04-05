const Blog = ({ blog }) => (
  <div>
    <h1>{blog.title}</h1>
    <p>by {blog.author}</p>
  </div>  
)

export default Blog