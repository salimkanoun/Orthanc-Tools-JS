const request = require('supertest')
const express = require('express')
const app = express()
const route = require('../../routes/admin')
app.use('/api',route)

afterAll(async ()=>{
  const Role = require('../../repository/Role')
  const Label = require('../../repository/Label')
  const User = require('../../repository/User')
  const UserLabel = require('../../repository/UserLabel')
  const StudyLabel = require('../../repository/StudyLabel')

  //Post
  let role = await Role.getRole('test')
  if(role){
    await Role.delete('test')
  }
  let label = await Label.getLabel('test')
  if(label){
    await Label.delete('test')
  }
  let user = await User.getUser('admin')
  let userlabel = await UserLabel.getUserLabel(user.id,'test')
  if(userlabel){
    await UserLabel.delete(user.id,'test')
  }
  let studylabel = await StudyLabel.getStudyLabel('ABCDEFG','test')
  if(studylabel){
    await StudyLabel.delete('ABCDEFG','test')
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
  app.use('/api',route)
  it('Labels',async()=>{
    const label ={
      label_name : 'test'
    }

    const res = await request(app)
    .post('/api/labels')
    .send({label})
    .set('Content-type', 'application/json')
    .then((response)=>{
      expect(response.statusCode).toBe(201)
    })
  })

  it('Roles',async()=>{
    const role = {
      name: 'test'
    }
    const res = await request(app)
    .post('/api/roles')
    .set('Content-type', 'application/json')
    .send(role)
    .then((response)=>{
      expect(response.statusCode).toBe(201)
    })
  })

  it('StudyLabels',async()=>{
    const studylabel = {
      study_instance_uid:'ABCDEFG',
      label_name:'test'
    }
    const res = await request(app)
    .post('/api/studylabels')
    .set('Content-type', 'application/json')
    .send(studylabel)
    .then((response)=>{
      expect(response.statusCode).toBe(201)
    })
  })

  it('UserLabels',async()=>{
    const User = require('../../repository/User')
    const user= User.getUser('admin')
    const userlabel = {
      user_id:user.id,
      label_name:'test'
    }
    const res = await request(app)
    .post('/api/userlabels')
    .set('Content-type', 'application/json')
    .send(userlabel)
    .then((response)=>{
      expect(response.statusCode).toBe(201)
    })
  })
})

describe('PUT/',()=>{

})

describe('DELETE/',()=>{
  
})