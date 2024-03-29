const express = require('express')
const router = express.Router()
const {Client} = require('../route')
const Controller = require('../../app/controllers/Controller')
const Middleware = require('../../app/kernel')

router.get('/:warehouse_id/product-consigment', [Middleware.posAuthenticate], Controller.Client.PointofSalesController.getProductConsigment)

module.exports = router