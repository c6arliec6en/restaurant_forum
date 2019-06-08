const db = require('../models')
const Restaurant = db.Restaurant

const adminControllers = {
  getRestaurants: (req, res) => {
    Restaurant.findAll().then(restaurants => {
      return res.render('admin/restaurants', { restaurants: restaurants })
    })
  }
}

module.exports = adminControllers