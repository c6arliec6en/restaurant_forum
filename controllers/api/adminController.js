const db = require('../../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'b450ce85a79cd98'

const adminServices = require('../../services/adminServices')

const adminControllers = {
  getRestaurants: (req, res) => {
    adminServices.getRestaurants(req, res, (data) => {
      return res.json({ data })
    })
  },
  getRestaurant: (req, res) => {
    adminServices.getRestaurant(req, res, (data) => {
      return res.json({ data })
    })
  },
  getCategories: (req, res) => {
    adminServices.getCategories(req, res, (data) => {
      return res.json({ data })
    })
  },


}

module.exports = adminControllers