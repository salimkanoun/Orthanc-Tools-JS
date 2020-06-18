var Users = require('../model/Users')
const jwt = require("jsonwebtoken")

authentication = async function (req, res) {
  const body = req.body
  try {
    const userObject = new Users(body.username)
    const checkPassword = await userObject.checkPassword(body.password)
    if (checkPassword) {

    //access SECRET_TOKEN
      const dotenv = require("dotenv");
      // get config vars
      dotenv.config();
      // access config var
      process.env.TOKEN_SECRET;

      payload = {
        username: body.username,
        admin: true,
        upload: true,
        content: true,
        anon: true,
        exportLocal: true,
        exportExtern: true,
        query: true,
        autoQuery: true,
        delet: true
      }

      //, { expiresIn: '3600s' }
      var TOKEN = jwt.sign('a', process.env.TOKEN_SECRET);
      console.log(TOKEN)

      req.session.username = body.username
      res.json(TOKEN);
    } else {
      res.status(401).send('Wrong Credential')
    }
  } catch (Error) {
    res.status(401).send('Unknown user')
  }
}, 

logOut = function (req, res){
  try {
    
  } catch (error){
    console.log(error)
    console.log('logOut fail')
  }
  
}

module.exports = { authentication, logOut }



//encien fonction 
/*
authentication = async function (req, res) {
  const body = req.body
  try {
    const userObject = new Users(body.username)
    const checkPassword = await userObject.checkPassword(body.password)
    if (checkPassword) {
      req.session.username = body.username
      res.json(true)
    } else {
      res.status(401).send('Wrong Credential')
    }
  } catch (Error) {
    res.status(401).send('Unknown user')
  }
}*/

/*
logOut = function (req, res){
  try {
    req.session.destroy()
    res.json(true)
  } catch (error){
    console.log(error)
    console.log('logOut fail')
  }
  
}
*/