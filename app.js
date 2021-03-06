const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const exphbs = require('express-handlebars')
const db = require('./models')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('./config/passport')
const methodOverride = require('method-override')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.set('view engine', 'handlebars')
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: 'Hello',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))


app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})


app.listen(port, () => {
  db.sequelize.sync()
  console.log("Express running")
})


require('./routes')(app, passport)