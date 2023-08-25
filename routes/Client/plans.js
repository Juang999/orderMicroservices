const express = require('express')
const router = express.Router()
const controller = require('../../app/controllers/Controller')
const middleware = require('../../app/kernel')
const {Client} = require('../route')

router.get(Client.feature.planning.planning_index_and_create, [middleware.authenticate], controller.Client.PlanController.getPlan)
router.get(Client.feature.planning.planning_detail, [middleware.authenticate], controller.Client.PlanController.getCustomerPerPeriode)
router.post(Client.feature.planning.planning_index_and_create, [middleware.authenticate], controller.Client.PlanController.createPlan)

module.exports = router