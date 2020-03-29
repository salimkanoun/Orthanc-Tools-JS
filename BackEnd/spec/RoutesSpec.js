// const request = require('supertest');
const express = require('express')

const app = express()

var apisRouter = require('../routes/index')
app.use('/api', apisRouter)
/*
describe('GET /options/orthanc-server', function(){
    it('respond with json', function(done){
      request('http://localhost:3000')
        .get('api/options/orthanc-server')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);
          done()
        });
    })
  });

  describe('PUT /options/orthanc-server', function(){
    it('respond with json', function(done){
      request('http://localhost:3000')
        .put('api/options/orthanc-server')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);
          done()
        });
    })
  });
  */
