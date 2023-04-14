const express = require('express')
const router = express.Router()
const controller = require('../app/controllers/Controller')
const middleware = require('../app/kernel')

let route = [
    '/group', //0
    '/customer', //1,
    '/periode' //2
]

router.get(route[0], [middleware.authenticate], controller.MasterController.getGroup)
router.get(route[1], [middleware.authenticate], controller.MasterController.getCustomer)
router.get(route[2], [middleware.authenticate], controller.MasterController.getPeriode)

module.exports = router