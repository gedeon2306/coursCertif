const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

let token = null

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // 1. Création de l'utilisateur de test
  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash
  })
  const savedUser = await user.save()

  // 2. Connexion pour récupérer un token JWT valide
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'secret' })

  token = loginResponse.body.token

  // 3. Insertion des blogs initiaux associés à cet utilisateur
  const blogObjects = helper.initialBlogs.map(blog => new Blog({
    ...blog,
    user: savedUser._id
  }))

  const promiseArray = blogObjects.map(blog => {
    const savedBlog = blog.save()
    savedUser.blogs = savedUser.blogs.concat(blog._id)
    return savedBlog
  })

  await Promise.all(promiseArray)
  await savedUser.save()
}, 15000)

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('addition of a new blog', () => {
  test('succeeds with valid data and valid token', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/users/ewd/transcriptions/EWD08xx/EWD808.html',
      likes: 12
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('Canonical string reduction')
  })

  test('fails with status code 401 Unauthorized if token is not provided', async () => {
    const newBlog = {
      title: 'Unauthorized Blog Post',
      author: 'Anonymous',
      url: 'http://example.com',
      likes: 0
    }

    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toBeDefined()

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('if likes property is missing, it defaults to 0', async () => {
    const newBlogWithoutLikes = {
      title: 'Blog without likes property',
      author: 'Test Author',
      url: 'https://example.com/no-likes'
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(0)
  })

  test('blog without title is not added and responds with status 400', async () => {
    const newBlogWithoutTitle = {
      author: 'Unknown Author',
      url: 'https://example.com/no-title',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogWithoutTitle)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('blog without url is not added and responds with status 400', async () => {
    const newBlogWithoutUrl = {
      title: 'Blog without URL',
      author: 'Unknown Author',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogWithoutUrl)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if token is valid and user is creator', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})