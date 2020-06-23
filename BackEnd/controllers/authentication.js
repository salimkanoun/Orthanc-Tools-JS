var Users = require('../model/Users')
const jwt = require("jsonwebtoken")

authentication = async function (req, res) {
  const body = req.body
  try {
    const userObject = new Users(body.username)
    const checkPassword = await userObject.checkPassword(body.password)
    if (checkPassword) {

      let user = new Users(body.username)
      let infosUser = await user.getUserRight()

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

      var TOKEN = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1h' });

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