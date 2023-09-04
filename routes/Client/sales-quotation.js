const express = require('express')
const router = express.Router()
const controller = require('../../app/controllers/Controller')
const middleware = require('../../app/kernel')
const {Client} = require('../route')

router.get(Client.feature.sales_quotation.sq_site, [middleware.authenticate], controller.Client.SalesQuotationController.getSite)
router.get(Client.feature.sales_quotation.sq_location, [middleware.authenticate], controller.Client.SalesQuotationController.getLocation)
router.get(Client.feature.sales_quotation.sq_total_debt, [middleware.authenticate], controller.Client.SalesQuotationController.sumDebtCustomer)
router.get(Client.feature.sales_quotation.sq_product_by_price, [middleware.authenticate], controller.Client.SalesQuotationController.getProduct)
router.get(Client.feature.sales_quotation.sq_index_and_create, [middleware.authenticate], controller.Client.SalesQuotationController.getSalesQuotation)
router.get(Client.feature.sales_quotation.sq_credit_limit, [middleware.authenticate], controller.Client.SalesQuotationController.getLimitCreditCustomer)
router.post(Client.feature.sales_quotation.sq_index_and_create, [middleware.authenticate], controller.Client.SalesQuotationController.createSalesQuotation)
router.get(Client.feature.sales_quotation.sq_price_list_by_group, [middleware.authenticate], controller.Client.SalesQuotationController.getPriceListGroupCustomer)

module.exports = router