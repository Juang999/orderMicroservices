const express = require('express')
const router = express.Router()
const controller = require('../../app/controllers/Controller')
const {Admin} = require('../route')
const middleware = require('../../app/kernel')

router.get(Admin.feature.visitation.index, [middleware.adminAuthenticate], controller.Admin.SalesQuotationController.index)
router.get(Admin.feature.visitation.visitation, [middleware.adminAuthenticate], controller.Admin.SalesQuotationController.visitation)
router.get(Admin.feature.visitation.visitation_schedule, [middleware.adminAuthenticate], controller.Admin.SalesQuotationController.visitation_schedule)
router.get(Admin.feature.visitation.visitation_detail, [middleware.adminAuthenticate], controller.Admin.SalesQuotationController.detailInvitation)
router.post(Admin.feature.visitation.visitation_create_periode, [middleware.adminAuthenticate], controller.Admin.SalesQuotationController.createPeriode)
router.get(Admin.feature.visitation.visitation_sales, [middleware.adminAuthenticate], controller.Admin.SalesQuotationController.getSales)
router.get(Admin.feature.visitation.visitation_checkin, [middleware.adminAuthenticate], controller.Admin.SalesQuotationController.getCheckinData)
router.get(Admin.feature.visitation.visitation_sales_quotation, [middleware.adminAuthenticate], controller.Admin.SalesQuotationController.getDataSOforSQ)
router.get(Admin.feature.visitation.visitation_output, [middleware.adminAuthenticate], controller.Admin.SalesQuotationController.getDataOutput)

module.exports = router