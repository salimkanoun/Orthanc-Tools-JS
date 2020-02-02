var Users = require('../model/Users')

var getResults = async function (req, res) {
  const body = req.body
  const userObject = new Users(body.username)
  const checkPassword = await userObject.checkPassword(body.password)
  if (checkPassword) {
    req.session.username = body.username
  }
  res.json(checkPassword)
}

module.exports = { getResults }
