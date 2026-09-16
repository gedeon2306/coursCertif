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

  // Validation manuelle du mot de passe (ne pas passer par Mongoose car c'est le hash qui est stocké)
  if (!password) {
    return response.status(400).json({ error: 'password is required' })
  }

  if (password.length < 3) {
    return response.status(400).json({ error: 'password must be at least 3 characters long' })
  }

  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (exception) {
    if (exception.name === 'ValidationError') {
      return response.status(400).json({ error: exception.message })
    }
    throw exception
  }
})

module.exports = usersRouter