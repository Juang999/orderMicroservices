const express = require('express')
const router = express.Router()
const controller = require('../app/controllers/Controller')
const middleware = require('../app/kernel')

let route = [
    '/group', //0
    '/customer', //1,
    '/periode', //2
    '/periode-customer', //3
    '/tax_invoice', //4
    '/addr_type', //5
    '/contact_person', //6
    '/bp_type', //7
    '/citizen', //8
    '/blood_group', //9
    '/gender', //10
    '/currency', //11
    '/entity', //12
    '/timestamp', //13
    '/default-periode', //14
    '/get-location' //15
]

router.get(route[0], [middleware.authenticate], controller.MasterController.getGroup)
router.get(route[1], [middleware.authenticate], controller.MasterController.getCustomer)
router.get(route[2], [middleware.authenticate], controller.MasterController.getPeriode)
router.get(route[3], [middleware.authenticate], controller.MasterController.getPeriodeSales)
router.get(route[4], [middleware.authenticate], controller.MasterController.getTaxInvoice)
router.get(route[5], [middleware.authenticate], controller.MasterController.getAddrType)
router.get(route[6], [middleware.authenticate], controller.MasterController.getContactPerson)
router.get(route[7], [middleware.authenticate], controller.MasterController.getBpType)
router.get(route[8], [middleware.authenticate], controller.MasterController.getCitizen)
router.get(route[9], [middleware.authenticate], controller.MasterController.getBloodGroup)
router.get(route[10], [middleware.authenticate], controller.MasterController.getGender)
router.get(route[11], [middleware.authenticate], controller.MasterController.getCurrency)
router.get(route[12], controller.MasterController.getEntity)
router.get(route[13], [middleware.authenticate], controller.MasterController.getTimeStamp)
router.get(route[14], controller.MasterController.getDefaultPeriode)
router.get(route[15], controller.MasterController.getLocation)

module.exports = router