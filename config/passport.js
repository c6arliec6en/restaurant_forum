const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const bcrypt = require('bcrypt-nodejs')


passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, username, password, done) => {
    User.findOne({ where: { email: username } }).then(user => {
      if (!user) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
      if (!bcrypt.compareSync(password, user.password)) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
      return done(null, user)
    })
  }
))

// serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
  User.findByPk(id, { include: [{ model: Restaurant, as: 'FavoritedRestaurants' }, { model: Restaurant, as: 'LikedRestaurants' }] }).then(user => {
    return done(null, user)
  })
})


module.exports = passport