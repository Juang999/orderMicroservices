const express = require('express')
const router = express.Router()
const controller = require('../../app/controllers/Controller')
const middleware = require('../../app/kernel')
const {Client} = require('../route')

/*
	API to get product for catalog
*/

// don't need token to access API
router.get('/size', controller.Client.ProductController.getSize)
router.get('/grade', controller.Client.ProductController.getGrade)
router.get('/', controller.Client.ProductController.getAllProduct)
router.get('/category', controller.Client.ProductController.getCategory)
router.get('/category/:cat_id/sub_category', controller.Client.ProductController.getSubCategory)

// need token to access API
router.get('/price', [middleware.authenticate], controller.Client.ProductController.getPriceList)
router.get('/location', [middleware.authenticate], controller.Client.ProductController.getProductByLocation)
router.get('/price-list', [middleware.authenticate], controller.Client.ProductController.getProductByPriceList)
router.get('/location/:pt_id/show', [middleware.authenticate], controller.Client.ProductController.showProductByLocation)
router.get('/price-list/:pt_id/show', [middleware.authenticate], controller.Client.ProductController.showProductByPriceList)

module.exports = router