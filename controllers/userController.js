const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '5d0182421d9b790'


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
  },

  getUser: (req, res) => {
    const searchBarUserId = Number(req.params.id)
    const currentUser = Number(req.user.id)
    User.findByPk(req.params.id, { include: { model: Comment, include: [Restaurant] } }).then(user => {
      let commentCount = 0
      user.Comments.forEach(comment => {
        commentCount += 1
      })

      res.render('profile', { user: user, searchBarUserId: searchBarUserId, currentUser: currentUser, commentCount: commentCount })
    })


  },

  editUser: (req, res) => {
    User.findByPk(req.user.id).then(user => {
      res.render('edituser', { user: user })
    })
  },

  putUser: (req, res) => {
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        User.findByPk(req.params.id).then(user => {
          user.update({
            name: req.body.name,
            image: file ? img.data.link : user.image
          }).then(user => {
            req.flash('success_messages', 'Edit user successfully')
            return res.redirect(`/users/${user.id}`)
          })
        })
      })
    } else {
      User.findByPk(req.params.id).then(user => {
        user.update({
          name: req.body.name,
          image: user.image
        }).then(user => {
          req.flash('success_messages', 'Edit user successfully')
          return res.redirect(`/users/${user.id}`)
        })
      })
    }
  },

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then(restaurant => {
        return res.redirect('back')
      })
  },

  removeFavorite: (req, res) => {
    return Favorite.findOne({ where: { UserId: req.user.id, RestaurantId: req.params.restaurantId } })
      .then(favorite => {
        favorite.destroy()
          .then(() => {
            return res.redirect('back')
          })
      })
  },

  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.id
    }).then(restaurant => {
      return res.redirect('back')
    })
  },

  removeLike: (req, res) => {
    Like.findOne({ where: { UserId: req.user.id, RestaurantId: req.params.id } }).then(like => {
      like.destroy().then(() => {
        return res.redirect('back')
      })
    })
  }

}

module.exports = userControllers