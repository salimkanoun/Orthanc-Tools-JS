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
      roleName: infosUser.name,
      roles: {
        admin: infosUser.admin,
        import: infosUser.import,
        content: infosUser.content,
        anon: infosUser.anon,
        exportLocal: infosUser.export_local,
        exportRemote: infosUser.export_remote,
        query: infosUser.query,
        autoQuery: infosUser.auto_query,
        delete: infosUser.delete,
        modify: infosUser.modify,
        cdBurner: infosUser.cd_burner,
        autorouting: infosUser.autorouting
      }

    }
    if (process.env.NODE_ENV != 'test') {
      var TOKEN = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '6h' });
    }
    res.send(TOKEN)

  } else {
    throw new OTJSUnauthorizedException("Wrong Credentials")
  }

}

module.exports = { login }