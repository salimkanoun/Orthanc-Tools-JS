const request = require('supertest')
const express = require('express')
const app = express()
const route = require('../../routes/admin')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
const Role = require('../../repository/Role')

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

  it('StudyLabels by StudyOrthancID',async()=>{
    const res = await request(app)
    .get('/api/studies/orthanc/a/labels')
    .set('Accept', 'application/json')
    .then((response)=>{
      expect(response.statusCode).toBe(201)
    })
  })

  it('RoleLabels',async ()=>{
    const route = '/api/users/labels'
    const res = await request(app)
    .get(route)
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('RoleLabels by Role Name',async ()=>{
    const rolelabel = {
      role_name:'admin'
    }
    const route = '/api/users/test/labels'
    const res = await request(app)
    .get(route)
    .send(rolelabel)
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('RoleLabels by Label',async ()=>{
    const route = '/api/users/labels/test'
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
    const Label = require('../../repository/Label')
    const label = await Label.getLabel('test')
    if(label){
      await Label.delete('test')
    }
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
    const payload= {
      study_orthanc_id:'a',
      patient_orthanc_id:'a'
    }

    const res = await request(app)
    .post('/api/patient/patient_test/studies/ABCDEFGH/labels/test')
    .set('Accept', 'application/json')
    .send(payload)
    .then((response)=>{
      expect(response.statusCode).toBe(201)
    })
  })

  it('RoleLabels',async()=>{
    const Label = require ('../../repository/Label.js')
    const label = await Label.getLabel('test')
    if(label==null){
      await Label.create('test')
    }
    const rolelabel={
      role_name:'admin'
    }
    const res = await request(app)
    .post('/api/users/test/labels/test')
    .set('Accept', 'application/json')
    .send(rolelabel)
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
    const res = await request(app)
    .post('/api/certificates/upload/1')
    .set('Accept', 'application/json')
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

  it('RoleLabels',async()=>{
    const rolelabel ={
      role_name:'admin'
    }

    const res = await request(app)
    .delete('/api/users/test/labels/test2')
    .set('Accept', 'application/json')
    .send(rolelabel)
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
    const SshKey = require('../../repository/SshKey')
    const ssh_key = await SshKey.saveKey(null,'test','test','test')
    /*
     Error: Invalid IV length
          at Decipheriv.createCipherBase (internal/crypto/cipher.js:103:19)
          at Decipheriv.createCipherWithIV (internal/crypto/cipher.js:121:20)
          at new Decipheriv (internal/crypto/cipher.js:264:22)
          at Object.createDecipheriv (crypto.js:131:10)
          at Object.decryptText (D:\IUT_Stage\Projet\Orthanc-Tools-JS\BackEnd\adapter\cryptoAdapter.js:22:27)
          at new SshKey (D:\IUT_Stage\Projet\Orthanc-Tools-JS\BackEnd\model\export\SshKey.js:13:31)
          at D:\IUT_Stage\Projet\Orthanc-Tools-JS\BackEnd\model\export\SshKey.js:46:53
          at removeKey (D:\IUT_Stage\Projet\Orthanc-Tools-JS\BackEnd\controllers\sshKey.js:28:19)

      at removeKey (controllers/sshKey.js:30:17)
    */
    const sshkey = {
      id : ssh_key.dataValues.id
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