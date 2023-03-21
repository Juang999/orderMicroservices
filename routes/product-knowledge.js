const express = require('express')
const router = express.Router()
const controller = require('../app/controllers/Controller')

router.get('/index', controller.ProductController.index)
router.get('/show/:pt_id', controller.ProductController.show)

module.exports = router