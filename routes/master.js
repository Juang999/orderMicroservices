const express = require('express')
const router = express.Router()
const controller = require('../app/controllers/Controller')

router.get('/group', controller.MasterController.getGroup)

module.exports = router