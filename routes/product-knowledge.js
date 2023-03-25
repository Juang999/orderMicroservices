const express = require('express')
const router = express.Router()
const controller = require('../app/controllers/Controller')

router.get('/index', controller.ProductController.index)
router.get('/show/:pt_desc2', controller.ProductController.show)

module.exports = router