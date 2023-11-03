const express = require('express')
const router = express.Router()
const controller = require('../../app/controllers/Controller')
const middleware = require('../../app/kernel')

router.get('/site', [middleware.authenticate], controller.Client.SalesQuotationController.getSite)
router.get('/', [middleware.authenticate], controller.Client.SalesQuotationController.getSalesQuotation)
router.get('/package', [middleware.authenticate], controller.Client.SalesQuotationController.getPackage)
router.post('/', [middleware.authenticate], controller.Client.SalesQuotationController.createSalesQuotation)
router.get('/:en_id/location', [middleware.authenticate], controller.Client.SalesQuotationController.getLocation)
router.get('/partner/:ptnrId/debt', [middleware.authenticate], controller.Client.SalesQuotationController.sumDebtCustomer)
router.get('/package/:package_oid/detail', [middleware.authenticate], controller.Client.SalesQuotationController.getDetailPackage)
router.get('/partner/:ptnrId/limit-credit', [middleware.authenticate], controller.Client.SalesQuotationController.getLimitCreditCustomer)
router.get('/price-list/:partnerGroupId/group', [middleware.authenticate], controller.Client.SalesQuotationController.getPriceListGroupCustomer)
router.get('/product/pricelist/:pricelistOid/area/:areaId/locationid/:locId', [middleware.authenticate], controller.Client.SalesQuotationController.getProduct)

module.exports = router