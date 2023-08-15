const express = require('express')
const router = express.Router()
const middleware = require('../../app/kernel')
const controller = require('../../app/controllers/Controller')
const {Client} = require('../route')

router.post(Client.feature.partnerContactAddress.contact_create, [middleware.authenticate], controller.Client.ParnterContactController.create)
router.get(Client.feature.partnerContactAddress.contact_detail, [middleware.authenticate], controller.Client.ParnterContactController.show)

module.exports = router