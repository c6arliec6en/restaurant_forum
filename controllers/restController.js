const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User

const pageLimit = 10

const restControllers = {

  getRestaurants: (req, res) => {
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    let whereQuery = {}
    let categoryId = ''
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }
    Restaurant.findAndCountAll({ include: Category, where: whereQuery, offset: offset, limit: pageLimit }).then(result => {
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1


      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50)
      })
      )
      Category.findAll().then(categories => {
        return res.render('restaurants', { restaurants: data, categories: categories, categoryId: categoryId, page: page, totalPage: totalPage, prev: prev, next: next })
      })

    })
  },

  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, { include: [Category, { model: Comment, include: [User] }] }).then(restaurant => {
      return res.render('restaurant', { restaurant: restaurant })
    })
  },

  getFeed: (req, res) => {
    Restaurant.findAll({ limit: 10, order: [['createdAt', 'DESC']], include: [Category] }).then(restaurants => {
      Comment.findAll({
        limit: 10, order: [['createdAt', 'DESC']], include: [User, Restaurant]
      }).then(comments => {
        return res.render('feeds', { restaurants: restaurants, comments: comments })
      })
    })
  }


}

module.exports = restControllers