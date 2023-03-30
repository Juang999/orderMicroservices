const express = require('express')
const router = express.Router()
const controller = require('../app/controllers/Controller')
const middleware = require('../app/kernel')

const route = [
    '/index', //0
    '/show/:pt_desc2', //1
    '/product/:product/color/:pt_code_color_id', //2
    '/product/:product/color/:pt_code_color_id/size/:pt_size_code_id/price/:pi_oid/entity/:en_id' //3
]

router.get(route[0], controller.ProductController.index)
router.get(route[1], controller.ProductController.show)
router.get(route[2], controller.ProductController.showSize)
router.get(route[3], controller.ProductController.showPrinceAndQty)


module.exports = router