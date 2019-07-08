const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const { User, Comment, Restaurant, Favorite, Like, Followship } = db
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID


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
    User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: [Restaurant] },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
        { model: Restaurant, as: 'FavoritedRestaurants' }
      ]
    }).then(user => {

      let commentRestaurants = []
      let removeSameObject = {}
      user.Comments.forEach(a => {
        removeSameObject[a.Restaurant.id] = a.Restaurant
      })
      for (let i in removeSameObject) {
        commentRestaurants.push(removeSameObject[i])
      }

      const commentCount = commentRestaurants.length
      const followingCount = user.Followings.length
      const followerCount = user.Followers.length
      const favoritedCount = user.FavoritedRestaurants.length

      res.render('profile', { user, searchBarUserId, currentUser, commentCount, commentRestaurants, followingCount, followerCount, favoritedCount })
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
  },

  getTopUser: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(a => a.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users })
    })
  },

  addFollow: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    }).then(follow => {
      return res.redirect('back')
    })
  },

  removeFollow: (req, res) => {
    Followship.findOne({ where: { followerId: req.user.id, followingId: req.params.userId } }).then(follow => {
      follow.destroy().then(() => {
        return res.redirect('back')
      })
    })
  }

}

module.exports = userControllers