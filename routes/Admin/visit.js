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
router.get(Admin.feature.visitation.visitation_periode, [middleware.adminAuthenticate], controller.Admin.SalesQuotationController.getPeriode)
router.get(Admin.feature.visitation.visitation_goal, [middleware.adminAuthenticate], controller.Admin.SalesQuotationController.getGoal)
router.get(Admin.feature.visitation.visitation_customer, [middleware.adminAuthenticate], controller.Admin.SalesQuotationController.getCustomer)
router.get(Admin.feature.visitation.visitation_code, [middleware.adminAuthenticate], controller.Admin.SalesQuotationController.getVisitationCodeSales)
router.post(Admin.feature.visitation.visitation_visit_customer, [middleware.adminAuthenticate], controller.Admin.SalesQuotationController.addNewCustomerToVisit)
router.get(Admin.feature.visitation.visitation_type, [middleware.adminAuthenticate], controller.Admin.SalesQuotationController.getTypeVisitation)

module.exports = router