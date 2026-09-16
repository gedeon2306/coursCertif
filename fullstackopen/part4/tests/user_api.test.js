const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const Blog = require('../models/blog')

const helper = require('./test_helper')
const bcrypt = require('bcrypt')

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // Créer un utilisateur de test par défaut
  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash
  })
  const savedUser = await user.save()

  // Associer cet utilisateur aux blogs initiaux
  const blogObjects = helper.initialBlogs.map(blog => new Blog({
    ...blog,
    user: savedUser._id
  }))

  const promiseArray = blogObjects.map(blog => {
    const savedBlog = blog.save()
    // Ajouter chaque blog au tableau de l'utilisateur
    savedUser.blogs = savedUser.blogs.concat(blog._id)
    return savedBlog
  })
  
  await Promise.all(promiseArray)
  await savedUser.save()
})

describe('creation of a new user', () => {
  test('fails with status code 400 if username is missing', async () => {
    const newUser = {
      name: 'Test User',
      password: 'password123'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('User validation failed: username')
  })

  test('fails with status code 400 if username is shorter than 3 characters', async () => {
    const newUser = {
      username: 'ab',
      name: 'Test User',
      password: 'password123'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('is shorter than the minimum allowed length (3)')
  })

  test('fails with status code 400 if password is missing', async () => {
    const newUser = {
      username: 'validuser',
      name: 'Test User'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('password is required')
  })

  test('fails with status code 400 if password is shorter than 3 characters', async () => {
    const newUser = {
      username: 'validuser',
      name: 'Test User',
      password: '12'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('password must be at least 3 characters long')
  })

  test('fails with status code 400 if username is not unique', async () => {
    const initialUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainenpassword'
    }

    await api.post('/api/users').send(initialUser)

    const duplicateUser = {
      username: 'root',
      name: 'Another User',
      password: 'anotherpassword'
    }

    const result = await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(400)

    expect(result.body.error).toContain('expected `username` to be unique')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})