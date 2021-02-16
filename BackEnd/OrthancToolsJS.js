var createError = require('http-errors')
var express = require('express')
var morgan = require('morgan')
var path = require('path')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var apisRouter = require('./routes/index')
var adminRouter = require('./routes/admin')
var usersRouter = require('./routes/users')
var authenticationRouter = require('./routes/authentication')

var app = express()

var autoStartMonitoring = require('./model/monitoring/AutoStartMonitoring')

const dotenv = require("dotenv");
const OTJSError = require('./Exceptions/OTJSError')
// get config vars
dotenv.config();

app.use(express.raw({ limit: '500mb', type: ['application/dicom', 'text/plain'] }))
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

var unless = function (path, middleware) {
  return function (req, res, next) {
    if (path === req.path) {
      return next()
    } else {
      return middleware(req, res, next)
    }
  }
}

// static routes
app.use('/', express.static(path.join(__dirname, 'build')));

app.use('/viewer-ohif/assets/', express.static(path.join(__dirname, 'build')));
app.use('/viewer-ohif/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'viewer-ohif', 'index.html'))
})

app.use('/viewer-stone/', express.static(path.join(__dirname, 'build')));
app.use('/viewer-stone/css/', express.static(path.join(__dirname, 'build')));
app.use('/viewer-stone/img/', express.static(path.join(__dirname, 'build')));
app.use('/viewer-stone/js/', express.static(path.join(__dirname, 'build')));
app.use('/viewer-stone/webfonts/', express.static(path.join(__dirname, 'build')));

app.use('/streamSaver/', express.static(path.join(__dirname, 'build')));

app.use('/api/authentication', authenticationRouter)
app.use('/api/users', usersRouter)
app.use('/api', adminRouter)
app.use('/api', apisRouter)

morgan.token('username', function (req, res) {
  return req.roles == null ? 'Not Authentified' : req.roles.username
})

app.use(
  unless('/',
    morgan(':remote-addr - [:date[clf]] ":method :url HTTPS/:http-version" :status :res[content-length] ":referrer" ":user-agent" ":username"')
  )
)

// If didn't found route catch 404 and forward to error handler
//SK A améliorer ne tient pas compte des routes dans le subrouter
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  if (req.app.get('env') === 'development') {
    console.error(err)
  }

  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof OTJSError) {
    res.status(err.getStatusCode()).json(err.getJsonPayload());
    return
  } else {
    return next(err);
  }
})
const port = 4000

app.listen(port, (error) => {

  if (error) {
    console.error(error)
    return process.exit(1)
  } else {
    console.log('Listening on port: ' + port)
    if (app.get('env') === 'production') {
      //Autostart monitonring service if needed
      autoStartMonitoring()
    }
  }
})

module.exports = app