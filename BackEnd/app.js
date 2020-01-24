require('dotenv').config()

var createError = require('http-errors')
var express = require('express')
var morgan = require('morgan')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var rfs = require('rotating-file-stream')
var session = require('express-session')

var apisRouter = require('./routes/index')
var usersRouter = require('./routes/users')

var app = express()

// static routes
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'build')))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(session({
  secret: 'ImageFetcher',
  resave: true,
  saveUninitialized: true
}))

var unless = function (path, middleware) {
  return function (req, res, next) {
    if (path === req.path) {
      return next()
    } else {
      return middleware(req, res, next)
    }
  }
}

var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, '/data/log')
})

logger.token('username', function (req, res) {
  return req.session.username
})
logger.token('post', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(unless('/', morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" ":username" ":post";', { stream: accessLogStream })))

//Serve compiled React front end
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use('/api', apisRouter)
app.use('/users', usersRouter)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log('error 404 salim')
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.end()
})

app.listen(4000, function () {
  console.log('Example app listening on port 3000!')
})

module.exports = app
