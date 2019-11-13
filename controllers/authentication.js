var Users = require('../model/Users')
var Database = require('../model/Database')

var getResults = async function (req, res) {
  const body = req.body
  console.log(body)
  if ('username' in body) {
    console.log(body.username)
    console.log(body.password)
    const databaseObject = new Database()
    await databaseObject.connectTable()

    const userObject = new Users(databaseObject.getDatabase(), body.username)
    await Users.createUser(databaseObject.getDatabase(), 'salim', 'salim', 0)
    await userObject.getDetails()
    const checkPassword = await userObject.checkPassword(body.password)
    console.log(checkPassword)
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(checkPassword))
  } else {
    res.render('authentication')
  }
}

module.exports = { getResults }
