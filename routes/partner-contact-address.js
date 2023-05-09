const express = require('express')
const router = express.Router()
const middleware = require('../app/kernel')
const controller = require('../app/controllers/Controller')

let route = [
    '/', //0 -> toCreateNewContact
    '/:ptnrac_oid' //1 -> toGetDetailContact
]

router.post(route[0], [middleware.authenticate], controller.ParnterContactController.create)
router.get(route[1], [middleware.authenticate], controller.ParnterContactController.show)

module.exports = router