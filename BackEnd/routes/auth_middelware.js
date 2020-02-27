const User = require('../model/Users')

const userAuthMidelware = function (req, res, next) {
  if (req.session.username !== undefined) {
    next()
  } else {
    console.log('No session')
    res.status(403).end()
  }
}

const userAdminMidelware = async function (req, res, next) {
  const user = new User(req.session.username)
  if (await user.isAdmin()) {
    next()
  } else {
    console.log('Admin status required')
    res.status(403).end()
  }
}

module.exports = { userAuthMidelware, userAdminMidelware }
