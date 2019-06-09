const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')

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

  app.get('/admin', isAdminAuthenticate, (req, res) => res.redirect('admin/restaurants'))
  app.get('/admin/restaurants', isAdminAuthenticate, adminController.getRestaurants)
  app.get('/admin/restaurants/create', isAdminAuthenticate, adminController.createRestaurant)
  app.post('/admin/restaurants', isAdminAuthenticate, adminController.postRestaurant)
  app.get('/admin/restaurants/:id', isAdminAuthenticate, adminController.getRestaurant)
  app.get('/admin/restaurants/:id/edit', isAdminAuthenticate, adminController.editRestaurant)
  app.put('/admin/restaurants/:id/', isAdminAuthenticate, adminController.putRestaurant)
  app.delete('/admin/restaurants/:id', isAdminAuthenticate, adminController.deleteRestaurant)

  app.get('/admin/users', isAdminAuthenticate, adminController.getUsers)
  app.get('/admin/users/:id/permission', isAdminAuthenticate, adminController.setPermission)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)


  app.get('/signin', userController.singInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logOut)
}

