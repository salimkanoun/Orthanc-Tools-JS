var Users = require('../model/Users')

//Sequelize DB 
const db = require('../database/models');

var getResults = async function (req, res) {
  const body = req.body
  console.log(body)
  if ('username' in body) {
    console.log(body.username)
    console.log(body.password)
    const userObject = new Users(body.username)
    const checkPassword = await userObject.checkPassword(body.password)
    if (checkPassword) {
      req.session.username = body.username
    }
    console.log(checkPassword)
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(checkPassword))
  } else {
    res.render('authentication')
  }
}

module.exports = { getResults }
