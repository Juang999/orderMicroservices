const express = require('express')
const router = express.Router()
const controller = require('../app/controllers/Controller')
const middleware = require('../app/kernel')

let route = [
    '/get-plan', //0
    '/create-unplan', //1
    '/customer-per-periode' //2
]

router.get(route[0], [middleware.authenticate], controller.PlanController.getPlan)
router.post(route[1], [middleware.authenticate], controller.PlanController.createUnplan)
router.get(route[2], [middleware.authenticate], controller.PlanController.getCustomerPerPeriode)

module.exports = router