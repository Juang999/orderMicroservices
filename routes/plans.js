const express = require('express')
const router = express.Router()
const controller = require('../app/controllers/Controller')
const middleware = require('../app/kernel')

let route = [
    '/get-plan' //0
]

router.get(route[0], [middleware.authenticate], controller.PlanController.getPlan)

module.exports = router