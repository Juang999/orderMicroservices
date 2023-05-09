const express = require("express")
const router = express.Router()
const controller = require("../app/controllers/Controller")
const middleware = require('../app/kernel')

let route = [
    '/partner', //0
    '/customer', //1
    '/create-partner', //2
    '/detail-partner/:ptnr_oid', //3
]

router.get(route[0], [middleware.authenticate], controller.PartnerController.getPartner);
router.get(route[1], [middleware.authenticate], controller.PartnerController.getCustomer);
router.post(route[2], [middleware.authenticate], controller.PartnerController.createNewPartner);
// router.get(route[3], [middleware.authenticate], controller.PartnerController.getDetailCustomer);

module.exports = router