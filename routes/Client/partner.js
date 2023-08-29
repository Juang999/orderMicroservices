const express = require('express')
const router = express.Router()
const controller = require('../../app/controllers/Controller')
const middleware = require('../../app/kernel')
const {Client} = require('../route')

router.get(Client.feature.partner.partner_detail, [middleware.authenticate], controller.Client.PartnerController.getDetailCustomer)
router.get(Client.feature.partner.partner_index_and_create, [middleware.authenticate], controller.Client.PartnerController.getPartner)
router.post(Client.feature.partner.partner_index_and_create, [middleware.authenticate], controller.Client.PartnerController.createNewPartner)
router.get(Client.feature.partner.partner_mitra, [middleware.authenticate], controller.Client.PartnerController.getSalesPartner)

module.exports = router