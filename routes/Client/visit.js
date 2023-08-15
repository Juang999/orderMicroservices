const express = require('express')
const router = express.Router()
const controller = require('../../app/controllers/Controller')
const middleware = require('../../app/kernel')
const {query, body} = require('express-validator')
const {Client} = require('../route')

router.get(Client.feature.visitation.visitation_index, [middleware.authenticate], controller.Client.VisitController.getVisitingSchedule)
router.get(Client.feature.visitation.visitation_schedule, [middleware.authenticate], controller.Client.VisitController.getDetailVisitSchedule)
router.get(Client.feature.visitation.visitation_detail, [middleware.authenticate], controller.Client.VisitController.getDetailVisiting)
router.post(Client.feature.visitation.visitation_create_schedule, [middleware.authenticate], controller.Client.VisitController.createSchedule)
router.post(Client.feature.visitation.visitation_input_custoer, [middleware.authenticate], controller.Client.VisitController.createListCustomerToVisit)
router.patch(Client.feature.visitation.visitation_check_in, [middleware.authenticate],  controller.Client.VisitController.checkIn)
router.patch(Client.feature.visitation.visitation_check_out, [middleware.authenticate], controller.Client.VisitController.checkOut)
router.delete(Client.feature.visitation.visitation_delete_customer, [middleware.authenticate], controller.Client.VisitController.deleteFromListSchedule)
router.delete(Client.feature.visitation.visitation_delete_schedule, [middleware.authenticate], controller.Client.VisitController.deleteSchedule)
router.get(Client.feature.visitation.visitation_type, [middleware.authenticate], controller.Client.VisitController.getVisitType)
router.get(Client.feature.visitation.visitation_output, [middleware.authenticate], controller.Client.VisitController.getOutputVisitType)
router.get(Client.feature.visitation.visitation_sales_periode, [middleware.authenticate], controller.Client.VisitController.getSalesPerPeriode)

module.exports = router