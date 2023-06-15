const express = require('express')
const router = express.Router()
const controller = require('../app/controllers/Controller')

router.get('/price', controller.PriceController.getPriceType)

module.exports = router