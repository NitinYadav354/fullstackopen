const _ = require('lodash')
const dummy = (blogs) => {
  return 1
} 

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((maxBlog, blog) => blog.likes > maxBlog.likes ? blog : maxBlog, blogs[0])

}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const grouped = _.groupBy(blogs, 'author')
  const authorMostBlog = _.maxBy(Object.keys(grouped), author => grouped[author].length)
  return {
    author: authorMostBlog,
    blogs: grouped[authorMostBlog].length
  }
}


const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const grouped = _.groupBy(blogs, 'author')
  const likedauthor = _.maxBy(Object.keys(grouped), author =>  _.sumBy(grouped[author], 'likes') )
  return {
    author: likedauthor,
    likes: _.sumBy(grouped[likedauthor], 'likes')
  }

}


module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }