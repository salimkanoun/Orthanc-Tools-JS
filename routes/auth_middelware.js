module.exports = function (req, res, next) {
  if (req.session.username !== undefined) {
    next()
  } else {
    console.log('No session')
    res.end()
  }
}
