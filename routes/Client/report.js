const express = require('express')
const router = express.Router()
const Controller = require('../../app/controllers/Controller')
const {authenticate} = require('../../app/kernel')

router.get('/debt', [authenticate], Controller.Client.ReportController.getHistoryDebt)
router.get('/sq', [authenticate], Controller.Client.ReportController.getDetailHistoryDebt)
router.get('/so', [authenticate], Controller.Client.ReportController.getTotalPersentageOfSales)
router.get('/so/:so_oid/shipment', [authenticate], Controller.Client.ReportController.getDataShipment)

module.exports = router