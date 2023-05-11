const express = require('express')
const router = express.Router()
const controller = require('../app/controllers/Controller')
const middleware = require('../app/kernel')

let route = [
    '/create-address-customer', //0
    '/detail-address-customer/:ptnra_oid', //1
]

router.post(route[0], [middleware.authenticate], controller.PartnerAddressController.create)
router.get(route[1], [middleware.authenticate], controller.PartnerAddressController.show)
// router.patch(route[1], [middleware.authenticate], controller.PartnerAddressController.activate)

module.exports = router