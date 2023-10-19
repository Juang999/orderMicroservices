const express = require('express')
const router = express.Router()
const controller = require('../../app/controllers/Controller')
const middleware = require('../../app/kernel')
const {Client} = require('../route')

router.get('/', [middleware.authenticate], controller.Client.PlanController.getPlan)
router.post('/', [middleware.authenticate], controller.Client.PlanController.createPlan)
router.get('/:plans_oid/detail', [middleware.authenticate], controller.Client.PlanController.getCustomerPerPeriode)

module.exports = router