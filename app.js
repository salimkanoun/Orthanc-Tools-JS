require('dotenv').config()

var createError = require('http-errors')
var express = require('express')
var morgan = require('morgan')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var rfs = require('rotating-file-stream')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')

var app = express()

// view engine setup
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', require('ejs').renderFile)
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
// SK AJOUTER VARIABLE DE SESSION UTILISATEUR DANS LOGS
// SEE https://github.com/expressjs/morgan
var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, '/data/log')
})
app.use(morgan('combined', { stream: accessLogStream }))

app.use('/', indexRouter)
app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log('error 404 salim')
  next(createError(404))
})

app.use((err, req, res, next) => {
  // handle error
  console.error(err);
});



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

module.exports = app
