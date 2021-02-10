const Users = require('../model/Users')
const jwt = require("jsonwebtoken")
const { OTJSBadRequestException, OTJSUnauthorizedException } = require('../Exceptions/OTJSErrors')

const login = async function (req, res) {
  const body = req.body

  if (!body.username || !body.password) {
    throw new OTJSBadRequestException('Missing Username / Password payload')
  }

  const userObject = new Users(body.username)

  let check = await userObject.checkPassword(body.password);

  if (check) {
    let infosUser = await userObject.getUserRight()
    let payload = {
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
      modify: infosUser.modify,
      cd_burner: infosUser.cd_burner
    }

    var TOKEN = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1h' });
    res.cookie("tokenOrthancJs", TOKEN, { httpOnly: true })
    res.json(payload)

  } else {
    throw new OTJSUnauthorizedException("Wrong Credentials")
  }

}

const logOut = function (req, res) {
  //Invalid the frontend cookie
  res.cookie("tokenOrthancJs", '', { httpOnly: true })
  res.sendStatus(200)
}

module.exports = { login, logOut }