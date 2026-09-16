const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// GET /api/users - Récupérer tous les utilisateurs
usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

// POST /api/users - Créer un nouvel utilisateur
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // Validation du mot de passe (présence et longueur minimale)
  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'password must be at least 3 characters long'
    })
  }

  // Validation de la présence du nom d'utilisateur
  if (!username || username.length < 3) {
    return response.status(400).json({
      error: 'username must be at least 3 characters long'
    })
  }

  // Vérification de l'unicité du nom d'utilisateur
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter