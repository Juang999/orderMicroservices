var express = require('express')
var router = express.Router()
const Controller = require('../app/controllers/Controller')
const {body} = require('express-validator')
const middleware = require('../app/kernel')
const {Admin, Client, logout} = require('./route')

// admin auth
router.post('/admin-login', Controller.Default.AuthController.loginAdmin)
router.get('/admin-profile', [middleware.adminAuthenticate], Controller.Default.AuthController.getProfileAdmin)
router.post('/authenticate', [middleware.adminAuthenticate], Controller.Default.AuthController.AuthenticateAdmin)

// client auth
router.post('/login', Controller.Default.AuthController.login)
router.post('/logout', [middleware.authenticate], Controller.Default.AuthController.logout)
router.get('/profile', [middleware.authenticate], Controller.Default.AuthController.profile)

module.exports = router
