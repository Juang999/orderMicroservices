const express = require('express')
const router = express.Router()
const controller = require('../app/controllers/Controller')
const middleware = require('../app/kernel')
const {query, body} = require('express-validator')

let route = [
    '/get-visiting-schedule', //1
    '/get-detail-visiting-schedule/:visit_code', //2
    '/get-detail-visiting/:visited_oid', //2
    '/create-schedule', //3
    '/create-list-customer-to-visit', //4
    '/checkin/:visited_oid', //5
    '/checkout/:visited_oid', //6
    '/visited_photo/:photo_name'
]

router.get(route[0], [middleware.authenticate], controller.VisitController.getVisitingSchedule)
router.get(route[1], [middleware.authenticate], controller.VisitController.getDetailVisitSchedule)
router.get(route[2], [middleware.authenticate], controller.VisitController.getDetailVisiting)
router.post(route[3], [middleware.authenticate], controller.VisitController.createSchedule)
router.post(route[4], [middleware.authenticate], controller.VisitController.createListCustomerToVisit)
router.patch(route[5], [middleware.authenticate, middleware.CheckinRequest],  controller.VisitController.checkIn)
router.patch(route[6], [middleware.authenticate, middleware.CheckoutRequest], controller.VisitController.checkOut)

module.exports = router