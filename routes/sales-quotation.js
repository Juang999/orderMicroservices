const express = require('express')
const router = express.Router()
const controller = require('../app/controllers/Controller')
const middleware = require('../app/kernel')

const route = [
	'/get-site', // 0
	'/get-location', // 1
	'/get-location-to', // 2
	'/get-location-git', // 3
	'/create-sales-quotation', //4
	'/get-sales-quotation', //5
	'/get-price-list/partnergroupid/:partnerGroupId', //6
	'/sum-debt-from-customer/ptnrid/:ptnrId', //8
	'/get-credit-limit-customer/ptnrid/:ptnrId' //9
]

router.get(route[0], [middleware.authenticate], controller.SalesQuotationController.getSite)
router.get(route[1], [middleware.authenticate], controller.SalesQuotationController.getLocation)
router.get(route[2], [middleware.authenticate], controller.SalesQuotationController.getLocationTo)
router.get(route[3], [middleware.authenticate], controller.SalesQuotationController.getLocationGit)
router.post(route[4], [middleware.authenticate], controller.SalesQuotationController.createSalesQuotation)
router.get(route[5], [middleware.authenticate], controller.SalesQuotationController.getSalesQuotation)
router.get(route[6], [middleware.authenticate], controller.SalesQuotationController.getPriceListGroupCustomer)
router.get(route[7], [middleware.authenticate], controller.SalesQuotationController.sumDebtCustomer)
router.get(route[8], [middleware.authenticate], controller.SalesQuotationController.getLimitCreditCustomer)

module.exports = router