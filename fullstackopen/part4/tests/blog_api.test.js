const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
}, 10000)

test('blogs are returned as json and correct amount is returned', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')

  // Vérifie le premier élément du tableau
  expect(response.body[0].id).toBeDefined()
  expect(response.body[0]._id).toBeUndefined()
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Async/await simplifies async code',
    author: 'jihreldev',
    url: 'https://jihreldev.vercel.app/',
    likes: 10,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain('Async/await simplifies async code')
})

afterAll(async () => {
  await mongoose.connection.close()
})