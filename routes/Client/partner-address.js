const express = require('express')
const router = express.Router()
const controller = require('../../app/controllers/Controller')
const middleware = require('../../app/kernel')
const {Client} = require('../route')

router.post('/', [middleware.authenticate], controller.Client.PartnerAddressController.create)
router.get('/:ptnra_oid/detail', [middleware.authenticate], controller.Client.PartnerAddressController.show)

module.exports = router