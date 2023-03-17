const express = require('express')
const router = express.Router()
const controller = require('../app/controllers/Controller')

router.get('/index', controller.ProductController.index)
router.get('/show/:pt_id', controller.ProductController.show)
router.get('/detail-product/:pt_id/:en_id', controller.ProductController.detailProduct)

module.exports = router