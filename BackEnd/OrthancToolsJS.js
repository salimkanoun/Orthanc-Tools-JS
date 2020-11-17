var createError = require('http-errors')
var express = require('express')
var morgan = require('morgan')
var path = require('path')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var logger = require('morgan')
var rfs = require('rotating-file-stream')
var session = require('express-session')
var open = require('open')

var apisRouter = require('./routes/index')
var usersRouter = require('./routes/users')

var app = express()

var autoStartMonitoring = require('./model/monitoring/AutoStartMonitoring')

const dotenv = require("dotenv");
  // get config vars
  dotenv.config();
  // access config var
  process.env.TOKEN_SECRET;

// static routes
app.use('/', express.static(path.join(__dirname, 'build')))
app.use('/viewer/', express.static(path.join(__dirname, 'build')));
app.use('/viewer/assets/', express.static(path.join(__dirname, 'build')));
app.use('/streamSaver/', express.static(path.join(__dirname, 'build')));

app.use(logger('dev'))
app.use(express.raw({ limit: '500mb', type: ['application/dicom', 'text/plain'] }))
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
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

var accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, '/data/log')
})

logger.token('username', function (req, res) {
  if (req.session)
    return req.session.username
})

logger.token('post', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(unless('/', morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTPS/:http-version" :status :res[content-length] ":referrer" ":user-agent" ":username" ":post";', { stream: accessLogStream })))

//For routes containing study UID redirect to OHIF index
app.get('/viewer/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'viewer', 'index.html'))
})

app.use('/api', apisRouter)
app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log('error 404')
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  console.log(err)
  // render the error page
  res.status(err.status || 500)
  res.end()
})

const port = 4000
  
app.listen(port, (error) => {
        if (error) {
          console.error(error)
          return process.exit(1)
        } else {
          console.log('Listening on port: ' + port)
          if (app.get('env') === 'production') {
            open('http://localhost:4000/')
            //Autostart monitonring service if needed
            autoStartMonitoring()
          }
        }
      })

module.exports = app