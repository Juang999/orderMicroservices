var express = require('express')
var router = express.Router()
const Controller = require('../app/controllers/Controller')
const {body} = require('express-validator')
const middleware = require('../app/kernel')
const {Admin, Client} = require('./route')

router.post(Client.feature.auth.login, Controller.Default.AuthController.login)
router.get(Client.feature.auth.profile, [middleware.authenticate], Controller.Default.AuthController.profile)
router.post(Admin.feature.auth.admin_login, Controller.Default.AuthController.loginAdmin)
router.post(Admin.feature.auth.authenticate, [middleware.adminAuthenticate], Controller.Default.AuthController.AuthenticateAdmin)
router.get(Admin.feature.auth.profile_admin, [middleware.adminAuthenticate], Controller.Default.AuthController.getProfileAdmin)

module.exports = router
