const express = require("express")
const router = express.Router()
const controller = require("../app/controllers/Controller")

router.get('/price/:group_id', controller.PriceController.getPriceType)

module.exports = router