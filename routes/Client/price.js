const express = require('express')
const router = express.Router()
const controller = require('../../app/controllers/Controller')

router.get('/price', controller.Client.PriceController.getPriceType)

module.exports = router