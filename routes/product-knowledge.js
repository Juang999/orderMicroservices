const express = require('express')
const router = express.Router()
const controller = require('../app/controllers/Controller')
const middleware = require('../app/kernel')

const route = [
    '/get-product-by-price-category', //0
    '/show-product-by-price-category/:pt_id/pi_oid/:pi_oid/entity/:entity', //1
    '/product/:product/color/:pt_code_color_id', //2
    '/get-price-list', //3
    '/product/:product/color/:color_id/size/:size_id', //4
    '/category', //5
    '/product/category/:category_id', //6
    '/category/sub_category/:cat_id', //7
    '/size', //8
    '/get-all-product', //9
    '/get-product-by-location', //10
    '/show-product-by-location/:pt_id/entity/:entity', //11
]
console.log(route[1])

router.get(route[0], [middleware.authenticate], controller.ProductController.getProductByPriceCategory)
router.get(route[1], [middleware.authenticate], controller.ProductController.showProductByPriceCategory)
router.get(route[2], [middleware.authenticate], controller.ProductController.showSize)
// router.get(route[3], [middleware.authenticate], controller.ProductController.showPrice)
router.get(route[4], [middleware.authenticate], controller.ProductController.showGrade)
router.get(route[5], controller.ProductController.getCategory)
router.get(route[6], [middleware.authenticate], controller.ProductController.getProductWithCategory)
router.get(route[7], [middleware.authenticate], controller.ProductController.getSubCategory)
router.get(route[8], [middleware.authenticate], controller.ProductController.getSize)
router.get(route[9], controller.ProductController.getAllProduct)
router.get(route[10], [middleware.authenticate], controller.ProductController.getProductByLocation)
router.get(route[11], [middleware.authenticate], controller.ProductController.showProductByLocation)

module.exports = router