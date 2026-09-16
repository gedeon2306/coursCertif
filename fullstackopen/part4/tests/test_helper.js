const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
]

// Génère un ID Mongoose valide mais qui n'existe dans aucune collection
const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', url: 'http://temp.com' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

// Récupère tous les blogs actuellement en base de données au format JSON
const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

// Récupère tous les utilisateurs actuellement en base de données au format JSON
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb
}