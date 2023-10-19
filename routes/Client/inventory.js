const express = require('express')
const router = express.Router()
const Controller = require('../../app/controllers/Controller')
const {Client} = require('../route')
const {authenticate} = require('../../app/kernel')

router.get('/:ptnr_id/exapro', [authenticate], Controller.Client.InventoryController.getDataInventoryExapro)
router.get('/transfer-receipt', [authenticate], Controller.Client.InventoryController.getInventoryTransferReceipt)
router.patch('/:ptsfr_oid/update-transfer-receipt', [authenticate], Controller.Client.InventoryController.updateTransferReceipt)
router.get('/:ptsfr_oid/detail-transfer-receipt', [authenticate], Controller.Client.InventoryController.detailInventoryTransferReceipt)

module.exports = router