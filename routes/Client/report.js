const express = require('express')
const router = express.Router()
const Controller = require('../../app/controllers/Controller')
const {Client} = require('../route')
const {authenticate} = require('../../app/kernel')

router.get(Client.feature.report.report_total_so, [authenticate], Controller.Client.ReportController.getTotalPersentageOfSales)

module.exports = router