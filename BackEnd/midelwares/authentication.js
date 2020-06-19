const User = require('../model/Users')
const { decode } = require('jsonwebtoken')
const jwt = require("jsonwebtoken")

const userAuthMidelware = function (req, res, next) {
  
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401) // if there isn't any token

   //access SECRET_TOKEN
   const dotenv = require("dotenv");
   // get config vars
   dotenv.config();
   // access config var
   process.env.TOKEN_SECRET;

   //!!!!!!!with SECRET_TOKEN it s don t work and its crash  but with "a" no error but it s dont work 
  var decoded = jwt.verify(token, "a", function(err, decoded) {
    console.log(err)
    console.log("LOLOLOLOLO")
    console.log(decoded)//Affiche correctement le token!!!!

    if (err) return res.sendStatus(403)
      //req.user = user //DECLENCHE une erreur 
      console.log("NICKEL")
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
        console.log("LOL")
        //req.user = user //DECLENCHE une erreur 
        next() // pass the execution off to whatever request the client intended
      }
    });

}

module.exports = { userAuthMidelware, userAdminMidelware }