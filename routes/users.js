var express = require('express');
var router = express.Router();
const AuthController = require("../app/controllers/AuthController");
const {body} = require('express-validator')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', AuthController.login)
router.post('/authenticate', AuthController.authenticate)

module.exports = router;
