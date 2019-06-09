const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User

const adminControllers = {
  getRestaurants: (req, res) => {
    Restaurant.findAll().then(restaurants => {
      return res.render('admin/restaurants', { restaurants: restaurants })
    })
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    Restaurant.create({
      name: req.body.name,
      tel: req.body.tel,
      address: req.body.address,
      opening_hours: req.body.opening_hours,
      description: req.body.description
    }).then(restaurant => {
      req.flash('success_messages', 'Restaurant was successfully created')
      res.redirect('/admin/restaurants')
    })
  },

  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id).then(restaurant => {
      return res.render('admin/restaurant', { restaurant: restaurant })
    })
  },

  editRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id).then(restaurant => {
      return res.render('admin/create', { restaurant: restaurant })
    })
  },

  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "Name cant be blank")
      return res.redirect('back')
    }
    Restaurant.findByPk(req.params.id).then(restaurant => {
      restaurant.update({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description
      }).then(restaurant => {
        req.flash('success_messages', 'Restaurant was be successfully updated')
        return res.redirect('/admin/restaurants')
      })
    })

  },

  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            res.redirect('/admin/restaurants')
          })
      })
  },

  getUsers: (req, res) => {
    User.findAll().then(users => {
      return res.render('admin/users', { users: users })
    })
  },

  setPermission: (req, res) => {
    User.findByPk(req.params.id).then(user => {
      if (!user.isAdmin) {
        console.log('false!')
        user.update({
          isAdmin: true
        }).then(user => {
          return res.redirect('/admin/users')
        })
      } else {
        user.update({
          isAdmin: false
        }).then(user => {
          return res.redirect('/admin/users')
        })
      }

    })
  }
}

module.exports = adminControllers