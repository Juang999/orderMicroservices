const express = require("express")
const router = express.Router()
const controller = require("../app/controllers/Controller")
const middleware = require('../app/kernel')

let route = [
    '/partner'
]

router.get(route[0], [middleware.authenticate], controller.PartnerController.getPartner)

module.exports = router