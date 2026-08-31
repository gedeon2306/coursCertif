const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// Exercice 3.8 : Définition d'un token personnalisé pour morgan
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

// Exercice 3.7 & 3.8 : Configuration de Morgan
// Format personnalisé : tiny + affichage du body à la fin
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// Données initiales en mémoire
let persons = [
  { 
    id: 1,
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: 2,
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: 3,
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: 4,
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
]

// Exercice 3.1: GET /api/persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// Exercice 3.2: GET /info
app.get('/info', (request, response) => {
  const count = persons.length
  const date = new Date()
  
  response.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${date}</p>
  `)
})

// Exercice 3.3: GET /api/persons/:id
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// Exercice 3.4: DELETE /api/persons/:id
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

// Exercices 3.5 & 3.6: POST /api/persons (Ajout + Validations)
const generateId = () => {
  // Génère un ID entier aléatoire entre 1 et 10 000
  return Math.floor(Math.random() * 10000) + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  // Validation : Vérifie la présence du nom et du numéro
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    })
  }

  // Validation : Vérifie que le nom est unique
  const nameExists = persons.some(p => p.name.toLowerCase() === body.name.toLowerCase())
  if (nameExists) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})