var Users = require('../model/Users')
var Database = require('../model/Database')

//Sequelize DB 
const db = require('../database/models');

var getResults = async function (req, res) {
  const body = req.body
  console.log(body)
  if ('username' in body) {
    console.log(body.username)
    console.log(body.password)
    const database = await Database.getDatabase()
    let user = await db.User.findOne({ where: { username: body.username } })
    if(body.password === user.password){
      console.log('SeQueLize Sucess')
    }
    const userObject = new Users(database, body.username)
    await Users.createUser(database, 'salim', 'salim', 0)
    await userObject.getDetails()
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
