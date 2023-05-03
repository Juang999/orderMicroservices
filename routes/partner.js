const express = require("express")
const router = express.Router()
const controller = require("../app/controllers/Controller")
const middleware = require('../app/kernel')

let route = [
    '/partner', //0
    
    '/create-partner', //1
    '/create-address-partner', //2
    '/create-contact-person', //3
    '/detail-partner/:ptnr_oid', //4
    '/detail-partner-address/:ptnra_oid' //5
]

router.get(route[0], [middleware.authenticate], controller.PartnerController.getPartner);
router.post(route[1], [middleware.authenticate], controller.PartnerController.createNewPartner);
router.post(route[2], [middleware.authenticate], controller.PartnerController.createAddressPartner);
router.post(route[3], [middleware.authenticate], controller.PartnerController.createContactPerson);
router.get(route[4], [middleware.authenticate], controller.PartnerController.getDetailCustomer)
router.get(route[5], [middleware.authenticate], controller.PartnerController.getDetailAddressCustomer)

module.exports = router