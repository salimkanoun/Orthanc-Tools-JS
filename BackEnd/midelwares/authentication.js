const jwt = require("jsonwebtoken")

const userAuthMidelware = function (req, res, next) {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401) // if there isn't any token

  let decoded = jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
    console.log(err)

    if (err) return res.sendStatus(403)
      next() // pass the execution off to whatever request the client intended
  });
  
}

const userAdminMidelware = async function (req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401) // if there isn't any token
  
    let decoded = jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
      console.log(err)
  
      if (err) return res.sendStatus(403)
      if(decoded.admin) {
        next() // pass the execution off to whatever request the client intended
      }
    });

}

module.exports = { userAuthMidelware, userAdminMidelware }