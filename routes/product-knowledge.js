const express = require('express')
const router = express.Router()
const controller = require('../app/controllers/Controller')
const middleware = require('../app/kernel')

const route = [
    '/index', //0
    '/show/:pt_desc2', //1
    '/product/:product/color/:pt_code_color_id', //2
    '/product/:product/color/:pt_code_color_id/size/:pt_size_code_id/price/:pi_oid/entity/:en_id/grade/:grade', //3
    '/product/:product/color/:color_id/size/:size_id' //4
]

router.get(route[0], [middleware.authenticate], controller.ProductController.index)
router.get(route[1], [middleware.authenticate], controller.ProductController.show)
router.get(route[2], [middleware.authenticate], controller.ProductController.showSize)
router.get(route[3], [middleware.authenticate], controller.ProductController.showPrinceAndQty)
router.get(route[4], [middleware.authenticate], controller.ProductController.showGrade)


module.exports = router