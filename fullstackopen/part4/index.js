require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

// Définition du schéma et transformation de la sortie JSON
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)

// Connexion à MongoDB Atlas
const mongoUrl = process.env.MONGODB_URI
mongoose.set('strictQuery', false)
mongoose.connect(mongoUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error.message))

// Middlewares
app.use(cors())
app.use(express.json())

// Routes API
app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

// Lancement du serveur
const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})