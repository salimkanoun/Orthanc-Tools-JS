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
        admin: infosUser.admin,
        import: infosUser.import,
        content: infosUser.content,
        anon: infosUser.anon,
        export_local: infosUser.export_local,
        export_extern: infosUser.export_extern,
        query: infosUser.query,
        auto_query: infosUser.auto_query,
        delete: infosUser.delete,
        modify: infosUser.modify
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
    console.log('user logs out') //Mettre en place un système pour rendre non viable le token apres deconnexion
  } catch (error){
    console.log(error)
    console.log('logOut fail')
  }
}

module.exports = { authentication, logOut }