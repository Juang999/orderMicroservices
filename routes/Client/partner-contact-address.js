const express = require('express')
const router = express.Router()
const middleware = require('../../app/kernel')
const controller = require('../../app/controllers/Controller')
const {Client} = require('../route')

router.post('/', [middleware.authenticate], controller.Client.ParnterContactController.create)
router.get('/:ptnrac_oid/detail', [middleware.authenticate], controller.Client.ParnterContactController.show)

module.exports = router