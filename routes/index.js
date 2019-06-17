const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
// const storage = multer.diskStorage({
//   destination: (req, file, done) => {
//     done(null, './upload')
//   },
//   filename: (req, file, done) => {
//     done(null, `${Date.now()}-${file.originalname}`)
//   }
// })
// const upload = multer({ storage: storage })


module.exports = (app, passport) => {



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

  app.get('/', authenticate, (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', authenticate, restController.getRestaurants)
  app.get('/restaurants/:id', authenticate, restController.getRestaurant)

  app.post('/comments', authenticate, commentController.postComment)
  app.delete('/comments/:id', isAdminAuthenticate, commentController.deleteComment)

  app.get('/users/:id', authenticate, userController.getUser)
  app.get('/users/:id/edit', authenticate, userController.editUser)
  app.put('/users/:id', authenticate, upload.single('image'), userController.putUser)

  app.get('/admin', isAdminAuthenticate, (req, res) => res.redirect('admin/restaurants'))
  app.get('/admin/restaurants', isAdminAuthenticate, adminController.getRestaurants)
  app.get('/admin/restaurants/create', isAdminAuthenticate, adminController.createRestaurant)
  app.post('/admin/restaurants', isAdminAuthenticate, upload.single('image'), adminController.postRestaurant)
  app.get('/admin/restaurants/:id', isAdminAuthenticate, adminController.getRestaurant)
  app.get('/admin/restaurants/:id/edit', isAdminAuthenticate, adminController.editRestaurant)
  app.put('/admin/restaurants/:id/', isAdminAuthenticate, upload.single('image'), adminController.putRestaurant)
  app.delete('/admin/restaurants/:id', isAdminAuthenticate, adminController.deleteRestaurant)

  app.get('/admin/categories', isAdminAuthenticate, categoryController.getCategories)
  app.post('/admin/categories', isAdminAuthenticate, categoryController.postCategory)
  app.get('/admin/categories/:id', isAdminAuthenticate, categoryController.getCategories)
  app.put('/admin/categories/:id/edit', isAdminAuthenticate, categoryController.putCategory)
  app.delete('/admin/categories/:id', isAdminAuthenticate, categoryController.deleteCategory)

  app.get('/admin/users', isAdminAuthenticate, adminController.getUsers)
  app.get('/admin/users/:id/permission', isAdminAuthenticate, adminController.setPermission)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)


  app.get('/signin', userController.singInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logOut)
}

