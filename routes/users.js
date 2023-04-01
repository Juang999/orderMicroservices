var express = require('express');
var router = express.Router();
const AuthController = require("../app/controllers/AuthController");
const {body} = require('express-validator')
const middleware = require('../app/kernel')

const route = [
  '/login', //0
  '/profile' //1
]

router.post(route[0], AuthController.login)
router.get(route[1], [middleware.authenticate], AuthController.profile)

module.exports = router;
