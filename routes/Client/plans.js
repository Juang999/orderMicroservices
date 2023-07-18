const express = require('express')
const router = express.Router()
const controller = require('../../app/controllers/Controller')
const middleware = require('../../app/kernel')
const {Client} = require('../route')

router.get(Client.feature.planning.planning_index, [middleware.authenticate], controller.Client.PlanController.getPlan)
router.post(Client.feature.planning.planning_create, [middleware.authenticate], controller.Client.PlanController.createPlan)
router.get(Client.feature.planning.planning_detail, [middleware.authenticate], controller.Client.PlanController.getCustomerPerPeriode)

module.exports = router