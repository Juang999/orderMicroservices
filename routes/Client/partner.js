const express = require('express')
const router = express.Router()
const controller = require('../../app/controllers/Controller')
const middleware = require('../../app/kernel')

router.get('/', [middleware.authenticate], controller.Client.PartnerController.getPartner)
router.post('/', [middleware.authenticate], controller.Client.PartnerController.createNewPartner)
router.get('/mitra', [middleware.authenticate], controller.Client.PartnerController.getSalesPartner)
router.get('/parent', [middleware.authenticate], controller.Client.PartnerController.getParentSales)
router.get('/partner', [middleware.authenticate], controller.Client.PartnerController.getPartnerPerParent)
router.get('/:ptnr_oid/detail', [middleware.authenticate], controller.Client.PartnerController.getDetailCustomer)
router.get('/warehouse', [middleware.posAuthenticate], controller.Client.PartnerController.getPartnerWithWarehouse)
router.get('/:warehouse_id/location', [middleware.posAuthenticate], controller.Client.PartnerController.getPartnerWithLocation)

module.exports = router