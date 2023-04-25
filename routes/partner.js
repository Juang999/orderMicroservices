const express = require("express")
const router = express.Router()
const controller = require("../app/controllers/Controller")
const middleware = require('../app/kernel')

let route = [
    '/partner', //0
    '/create-partner' //1
]

router.get(route[0], [middleware.authenticate], controller.PartnerController.getPartner);
router.post(route[1], [middleware.authenticate], controller.PartnerController.createNewPartner);

module.exports = router