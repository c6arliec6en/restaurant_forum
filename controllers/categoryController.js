const db = require('../models')
const Category = db.Category


module.exports = categoryController = {
  getCategories: (req, res) => {
    return Category.findAll().then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id).then(category => {
          return res.render('admin/categories', { category: category, categories: categories })
        })
      } else {
        return res.render('admin/categories', { categories: categories })
      }

    })
  },

  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    } else {
      return Category.create({
        name: req.body.name
      })
        .then((category) => {
          res.redirect('/admin/categories')
        })
    }
  },


  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'Please input a name')
      return res.render('admin/categories')
    } else {
      Category.findByPk(req.params.id).then(category => {
        category.update({
          name: req.body.name
        }).then(category => {
          return res.redirect('/admin/categories')
        })
      })
    }
  },

  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id).then(category => {
      category.destory().then(category => {
        return res.redirect('/admin/categories')
      })
    })
  }
}