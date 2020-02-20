var Users = require('../model/Users')

var authentication = async function (req, res) {
  const body = req.body
  try {
    const userObject = new Users(body.username)
    const checkPassword = await userObject.checkPassword(body.password)
    if (checkPassword) {
      req.session.username = body.username
      res.json(true)
    } else {
      res.send(401, 'Wrong Credential')
    }
  } catch (Error) {
    res.send(401, 'Unknown user')
  }
}

module.exports = { authentication }
