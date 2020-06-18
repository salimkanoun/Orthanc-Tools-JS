var Users = require('../model/Users')
var Token = require('../token/token')


authentication = async function (req, res) {
  const body = req.body
  try {
    const userObject = new Users(body.username)
    const checkPassword = await userObject.checkPassword(body.password)
    if (checkPassword) {
      //fait discontionner la connexion 
      /*const token = Token.generateAccessToken({
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
    });*/
      req.session.username = body.username
      res.json(true);
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