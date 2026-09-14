const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// Route pour récupérer tous les blogs
blogsRouter.get('/', (_request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

// Route pour ajouter un nouveau blog
blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then(result => {
    response.status(201).json(result)
  })
})

module.exports = blogsRouter