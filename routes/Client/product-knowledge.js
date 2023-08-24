const express = require('express')
const router = express.Router()
const controller = require('../../app/controllers/Controller')
const middleware = require('../../app/kernel')
const {Client} = require('../route')

/*
	API to get product for catalog
*/

// don't need token to access API
router.get(Client.feature.product.product_size, controller.Client.ProductController.getSize)
router.get(Client.feature.product.product_grade, controller.Client.ProductController.getGrade)
router.get(Client.feature.product.product_index, controller.Client.ProductController.getAllProduct)
router.get(Client.feature.product.product_category, controller.Client.ProductController.getCategory)
router.get(Client.feature.product.product_sub_category, controller.Client.ProductController.getSubCategory)

// need token to access API
router.get(Client.feature.product.product_price_list, [middleware.authenticate], controller.Client.ProductController.getPriceList)
router.get(Client.feature.product.product_by_location, [middleware.authenticate], controller.Client.ProductController.getProductByLocation)
router.get(Client.feature.product.product_by_price_list, [middleware.authenticate], controller.Client.ProductController.getProductByPriceList)
router.get(Client.feature.product.product_detail_by_location, [middleware.authenticate], controller.Client.ProductController.showProductByLocation)
router.get(Client.feature.product.product_detail_by_price_list, [middleware.authenticate], controller.Client.ProductController.showProductByPriceList)

module.exports = router