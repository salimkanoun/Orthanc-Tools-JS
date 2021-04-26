const request = require('supertest')
const express = require('express')
const app = express()
const route = require('../../routes/users')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')


app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser())
app.use('/api/users',route)

describe('Test Users routes',()=>{
  it('/GET',async()=>{
    const res = await request(app)
    .get('/api/users/')
    .set('Accept','applicaton/json')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('/POST',async ()=>{
    const user={
      username : 'test',
      password : 'test',
      role : 'admin'
    }
    const res = await request(app)
    .post('/api/users/')
    .set('Accept','applicaton/json')
    .send(user)
    .then((response)=>{
      expect(response.statusCode).toBe(201)
    })
  })

  it('/PUT',async()=>{
    const user={
      password : 'testnew',
      role : 'admin'
    }
    const res = await request(app)
    .put('/api/users/test')
    .set('Accept','applicaton/json')
    .send(user)
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('/DELETE',async()=>{
    const res = await request(app)
    .delete('/api/users/test')
    .set('Accept','applicaton/json')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

})  