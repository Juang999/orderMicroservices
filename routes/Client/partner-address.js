const express = require('express')
const router = express.Router()
const controller = require('../../app/controllers/Controller')
const middleware = require('../../app/kernel')
const {Client} = require('../route')

router.post(Client.feature.partnerAddress.address_create, [middleware.authenticate], controller.Client.PartnerAddressController.create)
router.get(Client.feature.partnerAddress.address_detail, [middleware.authenticate], controller.Client.PartnerAddressController.show)

module.exports = router