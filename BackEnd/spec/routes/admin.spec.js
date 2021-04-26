const request = require('supertest')
const express = require('express')
const app = express()
const route = require('../../routes/admin')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser())
app.use('/api',route)

describe('GET/',()=>{

  it('Labels',async ()=>{
    const res = await request(app)
    .get('/api/labels')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('StudyLabels',async ()=>{
    const res = await request(app)
    .get('/api/studies/labels')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('StudyLabels by label',async ()=>{
    const res = await request(app)
    .get('/api/studies/labels/test')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('StudyLabels by Study',async ()=>{
    const res = await request(app)
    .get('/api/studies/ABCDEFGH/labels/')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('UserLabels',async ()=>{
    const route = '/api/users/labels'
    const res = await request(app)
    .get(route)
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('UserLabels by User ID',async ()=>{
    const User = require('../../repository/User')
    const user= await User.getUser('admin')
    const route = '/api/users/'+user.id+'/labels'
    const res = await request(app)
    .get(route)
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('Roles',async ()=>{
    const res = await request(app)
    .get('/api/roles')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('Roles admin permissions',async ()=>{
    const res = await request(app)
    .get('/api/roles/?=admin')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
      expect(response.body[0].name).toBe('admin')
      expect(response.body[0].admin).toBeTruthy()
      expect(response.body[0].modify).toBeTruthy()
      expect(response.body[0].delete).toBeTruthy()
      expect(response.body[0].anon).toBeTruthy()
    })
  })

  it('SSHKeys',async ()=>{
    const res = await request(app)
    .get('/api/keys')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('Certificates',async ()=>{
    const res = await request(app)
    .get('/api/certificates')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('Endpoints',async ()=>{
    const res = await request(app)
    .get('/api/endpoints')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('Ldap Settings',async ()=>{
    const res = await request(app)
    .get('/api/ldap/settings')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('Mode',async ()=>{
    const res = await request(app)
    .get('/api/mode')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('Options',async ()=>{
    const res = await request(app)
    .get('/api/options')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })
})

describe('POST/',()=>{
  //app.use('/api',route)
  it('Labels',async()=>{
    const res = await request(app)
    .post('/api/labels/test')
    .set('Accept', 'application/json')
    .then((response)=>{
      expect(response.statusCode).toBe(201)
    })
  })
  
  it('Roles',async()=>{
    const role = {
      name : 'test'
    }
    const res = await request(app)
    .post('/api/roles')
    .set('Accept', 'application/json')
    .send(role)
    .then((response)=>{
      expect(response.statusCode).toBe(201)
    })
  })
  
  it('StudyLabels',async()=>{
    const Label = require ('../../repository/Label.js')
    const label = await Label.getLabel('test')
    if(label==null){
      await Label.create('test')
    }

    const res = await request(app)
    .post('/api/studies/ABCDEFGH/labels/test')
    .set('Accept', 'application/json')
    .then((response)=>{
      expect(response.statusCode).toBe(201)
    })
  })

  it('UserLabels',async()=>{
    const Label = require ('../../repository/Label.js')
    const label = await Label.getLabel('test')
    if(label==null){
      await Label.create('test')
    }
    const User = require('../../repository/User')
    const user= await User.getUser('admin')
    const res = await request(app)
    .post('/api/users/'+user.id+'/labels/test')
    .set('Accept', 'application/json')
    .then((response)=>{
      expect(response.statusCode).toBe(201)
    })
  })
  

  it('Certificates',async()=>{
    const certificate = {
      label : 'test',
      path : 'test'
    }
    const res = await request(app)
    .post('/api/certificates')
    .set('Accept', 'application/json')
    .send(certificate)
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('Certificates upload',async()=>{
    const certificate = {
      id : 1,
      label : 'test2',
    }
    const res = await request(app)
    .post('/api/certificates/upload/1')
    .set('Accept', 'application/json')
    .send(certificate)
    .then((response)=>{
      expect(response.statusCode).toBe(201)
    })
  })

  it('Endpoints', async ()=>{
    const endpoint = {
        label : 'test',
        host : 'localhost',
        targetFolder : 'oui',
        protocol : 'ftp'
    }
    const res = await request(app)
    .post('/api/endpoints/create')
    .set('Accept', 'application/json')
    .send(endpoint)
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('Endpoints update',async ()=>{
    const endpoint = {
      id : 1,
      label : 'test2',
      host : 'localhost',
      targetFolder : 'oui',
      protocol : 'webdav'
    }
    const res = await request(app)
    .post('/api/endpoints/update')
    .set('Accept', 'application/json')
    .send(endpoint)
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('SSHKeys',async()=>{
    const sshkey = {
      label : 'test'
    }
    const res  = await request(app)
    .post('/api/keys/create')
    .set('Accept', 'application/json')
    .send(sshkey)
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('SSHKeys update',async()=>{
    const sshkey={
      id : 1,
      label : 'test2'
    }
    const res  = await request(app)
    .post('/api/keys/update')
    .set('Accept', 'application/json')
    .send(sshkey)
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })
})

describe('PUT/',()=>{
  it('Labels',async()=>{
    const label ={
      label_name:'test2'
    }
    const res = await request(app)
    .put('/api/labels/test')
    .set('Accept', 'application/json')
    .send(label)
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('Roles', async()=>{
    const role = {
      name : 'test',
      import : false
    }
    const res = await request(app)
    .put('/api/roles')
    .set('Accept', 'application/json')
    .send(role)
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('mode ??',async()=>{  
    
  })

  it('Ldap Settings',async()=>{  
    const res = await request(app)
    .put('/api/ldap/settings')
    .set('Accept', 'application/json')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

})

describe('DELETE/',()=>{

  it('Roles',async()=>{
    const roles = {
      name : 'test'
    }
    const res = await request(app)
    .delete('/api/roles')
    .set('Accept', 'application/json')
    .send(roles)
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('UserLabels',async()=>{
    const User = require('../../repository/User')
    const user = await User.getUser('admin')

    const res = await request(app)
    .delete('/api/users/'+user.id+'/labels/test2')
    .set('Accept', 'application/json')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('StudyLabels',async()=>{
    const res = await request(app)
    .delete('/api/studies/ABCDEFGH/labels/test2')
    .set('Accept','application/json')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('Labels',async()=>{
    const res = await request(app)
    .delete('/api/labels/test2')
    .set('Accept','application/json')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('Endpoints',async()=>{
    const endpoint = {
      id : 1
    }
    const res = await request(app)
    .delete('/api/endpoints')
    .set('Accept','application/json')
    .send(endpoint)
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('SSHKeys',async()=>{
    const sshkey = {
      id : 1
    }
    const res = await request(app)
    .delete('/api/keys')
    .set('Accept','application/json')
    .send(sshkey)
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })
})