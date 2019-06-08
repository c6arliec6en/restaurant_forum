const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const userControllers = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.password !== req.body.passwordCheck) {
      req.flash('error_messages', '兩次密碼輸入不同')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '此信箱已註冊')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '註冊成功')
            return res.redirect('/signin')
          })
        }

      })
    }

  },

  singInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入')
    return res.redirect('/')
  },
  logOut: (req, res) => {
    req.flash('success_messages', '成功登出')
    req.logout()
    return res.render('signin')
  }
}

module.exports = userControllers