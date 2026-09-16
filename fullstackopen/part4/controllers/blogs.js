const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// GET /api/blogs - Récupérer les blogs avec les informations de l'utilisateur créateur
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

// POST /api/blogs - Créer un blog et l'associer à un utilisateur
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  // On récupère le premier utilisateur présent en base de données
  const users = await User.find({})
  const user = users[0]

  if (!user) {
    return response.status(400).json({ error: 'no user found in database to assign the blog' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  
  // Mettre à jour le tableau 'blogs' de l'utilisateur
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

module.exports = blogsRouter