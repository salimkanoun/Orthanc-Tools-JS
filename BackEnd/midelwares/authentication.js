const User = require('../model/Users')
const { decode } = require('jsonwebtoken')
const jwt = require("jsonwebtoken")

const userAuthMidelware = function (req, res, next) {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401) // if there isn't any token

   //!!!!!!!with SECRET_TOKEN it s don t work and its crash  but with "a" no error but it s dont work 
  var decoded = jwt.verify(token, "a", function(err, decoded) {
    console.log(err)

    if (err) return res.sendStatus(403)
      console.log("Est passé en tant que user")
      next() // pass the execution off to whatever request the client intended
  });
  
}

const userAdminMidelware = async function (req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401) // if there isn't any token
  
    //process.env.ACCESS_TOKEN_SECRET
    var decoded = jwt.verify(token, "a", function(err, decoded) {
      console.log(err)
  
      if (err) return res.sendStatus(403)
      if(decode.admin) {
        console.log("Est passé en tant que admin") 
        next() // pass the execution off to whatever request the client intended
      }
    });

}

module.exports = { userAuthMidelware, userAdminMidelware }