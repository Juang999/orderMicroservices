const express = require('express')
const router = express.Router()
const controller = require('../app/controllers/Controller')
const middleware = require('../app/kernel')

let route = [
    '/get-plan', //0
    '/create-unplan' //1
]

router.get(route[0], [middleware.authenticate], controller.PlanController.getPlan)
router.post(route[1], [middleware.authenticate], controller.PlanController.createUnplan)

module.exports = router