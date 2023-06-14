const express = require('express')
const router = express.Router()
const middleware = require('../app/kernel')
const controller = require('../app/controllers/Controller')

let route = [
	'/create-contact-address', //0 -> toCreateNewContact
	'/detail-contact-address/:ptnrac_oid' //1 -> toGetDetailContact
]

router.post(route[0], [middleware.authenticate], controller.ParnterContactController.create)
router.get(route[1], [middleware.authenticate], controller.ParnterContactController.show)

module.exports = router