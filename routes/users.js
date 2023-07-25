var express = require('express')
var router = express.Router()
const Controller = require('../app/controllers/Controller')
const {body} = require('express-validator')
const middleware = require('../app/kernel')

const route = [
	'/login', //0
	'/profile',
	'/admin-login' //1
]

router.post(route[0], Controller.Default.AuthController.login)
router.get(route[1], [middleware.authenticate], Controller.Default.AuthController.profile)
router.post(route[2], Controller.Default.AuthController.loginAdmin)

module.exports = router
