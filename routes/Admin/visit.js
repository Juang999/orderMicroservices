const express = require('express')
const router = express.Router()
const controller = require('../../app/controllers/Controller')
const {Admin} = require('../route')
const middleware = require('../../app/kernel')

router.get(Admin.feature.visitation.index, [middleware.authenticate], controller.Admin.SalesQuotationController.index)
router.get(Admin.feature.visitation.visitation, [middleware.authenticate], controller.Admin.SalesQuotationController.visitation)
router.get(Admin.feature.visitation.visitation_schedule, [middleware.authenticate], controller.Admin.SalesQuotationController.visitation_schedule)
router.get(Admin.feature.visitation.visitation_detail, [middleware.authenticate], controller.Admin.SalesQuotationController.detailInvitation)
router.post(Admin.feature.visitation.visitation_create_periode, [middleware.authenticate], controller.Admin.SalesQuotationController.createPeriode)

module.exports = router