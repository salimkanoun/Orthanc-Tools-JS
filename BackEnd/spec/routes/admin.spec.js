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

afterAll(async ()=>{
  const Role = require('../../repository/Role')
  const Label = require('../../repository/Label')
  const User = require('../../repository/User')
  const UserLabel = require('../../repository/UserLabel')
  const StudyLabel = require('../../repository/StudyLabel')
  const Certificate = require('../../repository/Certificate')

  //Post
  let role = await Role.getRole('test')
  if(role){
    await Role.delete('test')
  }
  let user = await User.getUser('admin')
  let userlabel = await UserLabel.getUserLabel(user.id,'test')
  if(userlabel){
    await UserLabel.delete(user.id,'test')
  }
  let studylabel = await StudyLabel.getStudyLabel('ABCDEFGH','test')
  if(studylabel){
    await StudyLabel.delete('ABCDEFGH','test')
  }

  let label = await Label.getLabel('test')
    if(label){
      let user = await User.getUser('admin')
    let userlabel = await UserLabel.getUserLabel(user.id,'test')
    if(userlabel){
      await UserLabel.delete(user.id,'test')
    }
    let studylabel = await StudyLabel.getStudyLabel('ABCDEFGH','test')
    if(studylabel){
      await StudyLabel.delete('ABCDEFGH','test')
    }
    await Label.delete('test')
  }

  let label2 = await Label.getLabel('test2')
  if(label2){
    let user = await User.getUser('admin')
  let userlabel = await UserLabel.getUserLabel(user.id,'test2')
  if(userlabel){
    await UserLabel.delete(user.id,'test2')
  }
  let studylabel = await StudyLabel.getStudyLabel('ABCDEFGH','test2')
  if(studylabel){
    await StudyLabel.delete('ABCDEFGH','test2')
  }
  await Label.delete('test2')
}

})

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
    .get('/api/studylabels')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('UserLabels',async ()=>{
    const res = await request(app)
    .get('/api/userlabels')
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

/* error 403
  it('Ldap Test',async ()=>{
    const res = await request(app)
    .get('/api/ldap/test')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })
 error 500
  it('Ldap Matches',async ()=>{
    const res = await request(app)
    .get('/api/ldap/matches')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })
 error 403
  it('Ldap Groupname',async ()=>{
    const res = await request(app)
    .get('/api/ldap/groupname')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })*/



/* error 500
  it('Plugins',async ()=>{
    const res = await request(app)
    .get('/api/plugins')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })
 error 500
  it('Verbosity',async ()=>{
    const res = await request(app)
    .get('/api/tools/log-level')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })*/
})

describe('POST/',()=>{
  //app.use('/api',route)
  it('Labels',async()=>{
    const label ={label_name: 'test'}
    const res = await request(app)
    .post('/api/labels')
    .set('Accept', 'application/json')
    .send(label)
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
      console.error(response)
      expect(response.statusCode).toBe(201)
    })
  })
  
  it('StudyLabels',async()=>{
    const Label = require ('../../repository/Label.js')
    const label = await Label.getLabel('test')
    if(label==null){
      await Label.create('test')
    }

    const studylabel = {
      study_instance_uid : 'ABCDEFGH',
       label_name : 'test'
    }
    const res = await request(app)
    .post('/api/studylabels')
    .set('Accept', 'application/json')
    .send(studylabel)
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
    
    const userlabel = {
      user_id : user.id,
      label_name : 'test'
    }
    const res = await request(app)
    .post('/api/userlabels')
    .send(userlabel)
    .set('Accept', 'application/json')
    .then((response)=>{
      expect(response.statusCode).toBe(201)
    })
  })

  it('Certificates',async()=>{
    const certificate = {
      label : 'test'
    }
    const res = await request(app)
    .post('/api/certificates')
    .set('Accept', 'application/json')
    .send(certificate)
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

})

describe('PUT/',()=>{
  it('Labels',async()=>{
    const label ={
      label_name:'test',
      new_label_name:'test2'
    }
    const res = await request(app)
    .put('/api/labels')
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

  it('mode ???',async()=>{

  })

})

describe('DELETE/',()=>{
  it('',async()=>{

  })
})