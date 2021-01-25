const Users = require('../model/Users')
const jwt = require("jsonwebtoken")

const login = async function (req, res) {
  const body = req.body

  const userObject = new Users(body.username)
  await userObject.checkPassword(body.password, async function (reponse) {

    if (reponse) {
      let user = new Users(body.username)
      user.getUserRight(function (infosUser) {
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
      })
    } else {
      res.status(401).json({ errorMessage: 'Wrong Credential' })
    }

  })

}

const logOut = function (req, res) {
  //Invalid the frontend cookie
  res.cookie("tokenOrthancJs", '', { httpOnly: true })
  res.sendStatus(200)
}

module.exports = { login, logOut }