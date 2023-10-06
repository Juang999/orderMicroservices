const express = require('express')
const router = express.Router()
const Controller = require('../../app/controllers/Controller')
const {Client} = require('../route')
const {authenticate} = require('../../app/kernel')

router.get(Client.feature.report.report_total_so, [authenticate], Controller.Client.ReportController.getTotalPersentageOfSales)
router.get(Client.feature.report.report_history_debt, [authenticate], Controller.Client.ReportController.getHistoryDebt)
router.get(Client.feature.report.report_detail_history_debt, [authenticate], Controller.Client.ReportController.getDetailHistoryDebt)
router.get(Client.feature.report.report_detail_shipment, [authenticate], Controller.Client.ReportController.getDataShipment)

module.exports = router