const request = require('supertest')
const express = require('express')
const app = express()
const route = require('../../routes/authentication')
const bodyParser = require('body-parser')


app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api/authentication',route)

describe('Test Authentication routes',()=>{
  it('login',async()=>{
    const user = {
      username:'admin',
      password:'admin'
    }
    const res = await request(app)
    .post('/api/authentication/')
    .set('Accept', 'application/json')
    .send(user)
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })
  
})  