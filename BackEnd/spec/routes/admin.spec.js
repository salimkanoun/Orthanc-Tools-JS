const request = require('supertest')
const express = require('express')
const app = express()
const route = require('../../routes/admin')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

//models required
const Label = require('../../model/Labels')
const StudyLabel = require('../../model/StudyLabel')
const RoleLabel = require('../../model/RoleLabel')
const Autorouter = require('../../repository/Autorouter')
const Role = require('../../model/Roles')
const Endpoint = require('../../repository/Endpoint')
const SSHKeys = require('../../model/export/SshKey')
const Certificate = require('../../model/export/Certificate')

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
    const route = '/api/users/test/roles/admin/labels'
    const res = await request(app)
    .get(route)
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
      expect(response.body[0].name).toBe('admin')
      expect(response.body[0].admin).toBeTruthy()
      expect(response.body[0].modify).toBeTruthy()
      expect(response.body[0].delete).toBeTruthy()
      expect(response.body[0].anon).toBeTruthy()
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

  it('Autorouters',async () => {
    const res = await request(app)
    .get('/api/autorouting')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('Autorouter by ID', async () => {
    await Autorouter.create('test',"ON",[{value1:'t',operator:'in',value2:'test'}],"New Studies",['aet'])
    let autorouter = await Autorouter.getOneByName('test')
    const res = await request(app)
    .get('/api/autorouting/'+autorouter.id)
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
    await Autorouter.delete(autorouter.id)
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
    await Label.deleteLabels('test')
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
    await Role.deleteRole('test')
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

    await StudyLabel.deleteStudyLabel('ABCDEFGH','test')
    await Label.deleteLabels('test')
  })

  it('RoleLabels',async()=>{
    await Label.createLabels('test')
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
    await RoleLabel.deleteRoleLabel('admin','test')
    await Label.deleteLabels('test')
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
    .then(async (response)=>{
      expect(response.statusCode).toBe(200)
    })
    var id
    let certificates  = await Certificate.getAllCertificates()
    for(var i = 0; i<certificates.length;i++){
      if(certificates[i].label==='test'){
        id=certificates[i].id
        break
      }
    }
    await Certificate.deleteCertificate(id)
  })

  it('Certificates upload',async()=>{
    await Certificate.createCertificate('test')
    var id
    let certificates  = await Certificate.getAllCertificates()
    for(var i = 0; i<certificates.length;i++){
      if(certificates[i].label==='test'){
        id=certificates[i].id
        break
      }
    }
    const res = await request(app)
    .post('/api/certificates/upload/'+id)
    .set('Accept', 'application/json')
    .then((response)=>{
      expect(response.statusCode).toBe(201)
    })
    await Certificate.deleteCertificate(id)
  })

  it('Endpoints', async ()=>{
    const endpoint = {
        label : 'test',
        host : 'localhost',
        targetFolder : 'oui',
        protocol : 'ftp'
    }
    const res = await request(app)
    .post('/api/endpoints/')
    .set('Accept', 'application/json')
    .send(endpoint)
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })

    let endpoint_delete = await Endpoint.getAllEndpoints()
    var id
    for(var i = 0; i<endpoint_delete.length; i++){
      if(endpoint_delete[i].label==='test'){
        id = endpoint_delete[i].id
        break
      }
    }
    await Endpoint.removeEndpoint(id)
  })

  it('SSHKeys',async()=>{
    const sshkey = {
      label : 'test',
      path:'./BackE',
      pass:'\uD800\uDFFF'
    }
    const res  = await request(app)
    .post('/api/keys/')
    .set('Accept', 'application/json')
    .send(sshkey)
    .then(async (response)=>{
      expect(response.statusCode).toBe(200)
      let key = await SSHKeys.getFromId(response.body.id)
      expect(key.id).toBe(response.body.id)
      expect(key.label).toBe(response.body.label)
      await key.deleteSshKey()
    })
  })

  it('SSHKeys upload',async()=>{
    let key = new SSHKeys({id:null,label:'test',path:'/uD800/uDFFF',pass:'\uD800\uDFFF'})
    var id = await SSHKeys.saveSshKey(key)
    const res  = await request(app)
    .post('/api/keys/upload/'+id)
    .set('Accept', 'application/json')
    .then(async (response)=>{
      expect(response.statusCode).toBe(201)
      let key = await SSHKeys.getFromId(id)
      await key.deleteSshKey()
    })
  })

  it('Autorouters',async () => {
    const autorouter = {
      condition:"ON",
      rules : [{value1:'t',operator:'in',value2:'test'}],
      target : "New Studies",
      destination : ['aet'],
    }
    const res = await request(app)
    .post('/api/autorouting/test')
    .set('Accept','application/json')
    .send(autorouter)
    .then((response)=>{
      expect(response.statusCode).toBe(201)
    })
    let autorouter_id=await Autorouter.getOneByName('test')
    await Autorouter.delete(autorouter_id.id)
  })
})

describe('PUT/',()=>{

  it('Endpoints update',async ()=>{
    await Endpoint.saveEndpoint(null,'test','localhost','','ftp',168,null,null,null,null,null)
    let endpoint_delete = await Endpoint.getAllEndpoints()
    var id
    for(var i = 0; i<endpoint_delete.length; i++){
      if(endpoint_delete[i].label==='test'){
        id = endpoint_delete[i].id
        break
      }
    }
    const endpoint = {
      id:id,
      label : 'test2',
      host : 'localhost',
      targetFolder : 'oui',
      protocol : 'webdav'
    }
    const res = await request(app)
    .put('/api/endpoints/')
    .set('Accept', 'application/json')
    .send(endpoint)
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })

    await Endpoint.removeEndpoint(id)
  })

  it('SSHKeys update',async()=>{
    let key = new SSHKeys({id:null,label:'test',path:'/uD800/uDFFF',pass:'\uD800\uDFFF'})
    var id = await SSHKeys.saveSshKey(key)
    const sshkey={
      id : id,
      label : 'test2'
    }
    const res  = await request(app)
    .put('/api/keys/')
    .set('Accept', 'application/json')
    .send(sshkey)
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
    let key_modified = await SSHKeys.getFromId(id)
    expect(key_modified.label).toBe('test2')
    key_modified.deleteSshKey()
  })

  it('Labels',async()=>{
    await Label.createLabels('test')
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
    await Label.deleteLabels('test2')
  })

  it('Roles', async()=>{
    await Role.createRoles({name:'test',import:true})
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
    await Role.deleteRole('test')
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

  it('Autorouters', async ()=>{
    await Autorouter.create('test',"ON",[{val:1}],'New Studies',['aet'])
    let autorouter = await Autorouter.getOneByName('test')
    const modify = {
      rules:[{test:'conclude'}]
    }
    const res = await request(app)
    .put('/api/autorouting/'+autorouter.id)
    .set('Accept','application/json')
    .send(modify)
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })

    autorouter = await Autorouter.getOneByName('test')
    expect(autorouter.rules[0].test).toEqual('conclude')
    expect(autorouter.target).toBe("New Studies")
    await Autorouter.delete(autorouter.id)
  })

  it('Autorouters switch ON/OFF', async ()=>{
    await Autorouter.create('test',"ON",[{val:1}],'New Studies',['aet'])
    let autorouter = await Autorouter.getOneByName('test')
    const modify = {
      running:!autorouter.running
    }
    const res = await request(app)
    .put('/api/autorouting/'+autorouter.id+'/running')
    .set('Accept','application/json')
    .send(modify)
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })

    autorouter = await Autorouter.getOneByName('test')
    expect(autorouter.running).toBeTruthy()
    expect(autorouter.target).toBe("New Studies")
    await Autorouter.delete(autorouter.id)
  })

})

describe('DELETE/',()=>{

  it('Roles',async()=>{
    await Role.createRoles({name:'test'})
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
    await Label.createLabels('test2')
    await RoleLabel.createRoleLabel('admin','test2')
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
    await Label.deleteLabels('test2')
  })

  it('StudyLabels',async()=>{
    await Label.createLabels('test2')
    await StudyLabel.createStudyLabel('ABCDEFGH','test2','a')
    const res = await request(app)
    .delete('/api/studies/ABCDEFGH/labels/test2')
    .set('Accept','application/json')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
    await Label.deleteLabels('test2')
  })

  it('Labels',async()=>{
    await Label.createLabels('test2')
    const res = await request(app)
    .delete('/api/labels/test2')
    .set('Accept','application/json')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('Endpoints',async()=>{
    await Endpoint.saveEndpoint(null,'test','localhost','','ftp',168,null,null,null,null,null)
    let endpoint_delete = await Endpoint.getAllEndpoints()
    var id
    for(var i = 0; i<endpoint_delete.length; i++){
      if(endpoint_delete[i].label==='test'){
        id = endpoint_delete[i].id
        break
      }
    }
    const endpoint = {
      id : id
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
    let key = new SSHKeys({id:null,label:'test',path:'/uD800/uDFFF',pass:'\uD800\uDFFF'})
    var id = await SSHKeys.saveSshKey(key)
    const sshkey = {
      id : id
    }
    const res = await request(app)
    .delete('/api/keys')
    .set('Accept','application/json')
    .send(sshkey)
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('Autorouters', async () => {
    await Autorouter.create('test',"ON",[{val:1}],'New Studies',['aet'])
    let autorouter = await Autorouter.getOneByName('test')

    const res = await request(app)
    .delete('/api/autorouting/'+autorouter.id)
    .set('Accept','application/json')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })

  it('Certificates',async ()=>{
    await Certificate.createCertificate('test')
    var id
    let certificates  = await Certificate.getAllCertificates()
    for(var i = 0; i<certificates.length;i++){
      if(certificates[i].label==='test'){
        id=certificates[i].id
        break
      }
    }
    const res = await request(app)
    .delete('/api/certificates/'+id)
    .set('Accept','application/json')
    .then((response)=>{
      expect(response.statusCode).toBe(200)
    })
  })
})