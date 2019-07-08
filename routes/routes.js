const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const authenticate = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  } return res.redirect('/signin')
}

const isAdminAuthenticate = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) { return next() }
    return res.redirect('/')
  }
  return res.redirect('/signin')
}

router.get('/', authenticate, (req, res) => res.redirect('/restaurants'))
router.get('/restaurants', authenticate, restController.getRestaurants)
router.get('/restaurants/top', authenticate, restController.getTopRestaurant)
router.get('/restaurants/feeds', authenticate, restController.getFeed)
router.get('/restaurants/:id', authenticate, restController.getRestaurant)
router.get('/restaurants/:id/dashboard', authenticate, restController.getRestaurantDashboard)

router.post('/comments', authenticate, commentController.postComment)
router.delete('/comments/:id', isAdminAuthenticate, commentController.deleteComment)

router.get('/users/top', authenticate, userController.getTopUser)
router.get('/users/:id', authenticate, userController.getUser)
router.get('/users/:id/edit', authenticate, userController.editUser)
router.put('/users/:id', authenticate, upload.single('image'), userController.putUser)

router.post('/favorite/:restaurantId', authenticate, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticate, userController.removeFavorite)
router.post('/like/:id', authenticate, userController.addLike)
router.delete('/like/:id', authenticate, userController.removeLike)
router.post('/following/:userId', authenticate, userController.addFollow)
router.delete('/following/:userId', authenticate, userController.removeFollow)

router.get('/admin', isAdminAuthenticate, (req, res) => res.redirect('admin/restaurants'))
router.get('/admin/restaurants', isAdminAuthenticate, adminController.getRestaurants)
router.get('/admin/restaurants/create', isAdminAuthenticate, adminController.createRestaurant)
router.post('/admin/restaurants', isAdminAuthenticate, upload.single('image'), adminController.postRestaurant)
router.get('/admin/restaurants/:id', isAdminAuthenticate, adminController.getRestaurant)
router.get('/admin/restaurants/:id/edit', isAdminAuthenticate, adminController.editRestaurant)
router.put('/admin/restaurants/:id/', isAdminAuthenticate, upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurants/:id', isAdminAuthenticate, adminController.deleteRestaurant)

router.get('/admin/categories', isAdminAuthenticate, categoryController.getCategories)
router.post('/admin/categories', isAdminAuthenticate, categoryController.postCategory)
router.get('/admin/categories/:id', isAdminAuthenticate, categoryController.getCategories)
router.put('/admin/categories/:id/edit', isAdminAuthenticate, categoryController.putCategory)
router.delete('/admin/categories/:id', isAdminAuthenticate, categoryController.deleteCategory)

router.get('/admin/users', isAdminAuthenticate, adminController.getUsers)
router.get('/admin/users/:id/permission', isAdminAuthenticate, adminController.setPermission)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)


router.get('/signin', userController.singInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logOut)


module.exports = router

