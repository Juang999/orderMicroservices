const express = require('express')
const router = express.Router()
const controller = require('../app/controllers/Controller')
const middleware = require('../app/kernel')

const route = [
	'/get-site', // 0
	'/get-location', // 1
	'/get-location-to', // 2
	'/get-location-git', // 3
	'/create-sales-quotation' //4
]

router.get(route[0], [middleware.authenticate], controller.SalesQuotationController.getSite)
router.get(route[1], [middleware.authenticate], controller.SalesQuotationController.getLocation)
router.get(route[2], [middleware.authenticate], controller.SalesQuotationController.getLocationTo)
router.get(route[3], [middleware.authenticate], controller.SalesQuotationController.getLocationGit)
router.post(route[4], [middleware.authenticate], controller.SalesQuotationController.createSalesQuotation)

module.exports = router