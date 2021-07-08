const request = require('supertest')
const express = require('express')
const app = express()
const route = require('../../routes/users')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
const User = require('../../model/Users')


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
    await User.deleteUser('test')
  })

  it('/PUT',async()=>{
    await User.createUser('test','test','test','test','test','admin',false)
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
    await User.deleteUser('test')
  })

  it('/DELETE',async()=>{
    await User.createUser('test','test','test','test','test','admin',false)
    const res = await request(app)
    .delete('/api/users/test')
    .set('Accept','applicaton/json')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

})  