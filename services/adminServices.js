const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'b450ce85a79cd98'


const adminServices = {
  getRestaurants: (req, res, callback) => {
    Restaurant.findAll({ include: [Category] }).then(restaurants => {
      callback({ restaurants: restaurants })
    })
  },
  getRestaurant: (req, res, callback) => {
    Restaurant.findByPk(req.params.id, { include: [Category] }).then(restaurant => {
      callback({ restaurant: restaurant })
    })
  },
  getCategories: (req, res, callback) => {
    Category.findAll().then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id).then(category => {
          callback({ category: category, categories: categories })
        })
      } else {
        callback({ categories: categories })
      }

    })
  },

}

module.exports = adminServices