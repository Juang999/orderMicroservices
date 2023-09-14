const express = require('express')
const router = express.Router()
const Controller = require('../../app/controllers/Controller')
const {Client} = require('../route')
const {authenticate} = require('../../app/kernel')

router.get(Client.feature.inventory.invc_transfer_receipt, [authenticate], Controller.Client.InventoryController.getInventoryTransferReceipt)
router.get(Client.feature.inventory.invc_detail_transfer_receipt, [authenticate], Controller.Client.InventoryController.detailInventoryTransferReceipt)
router.patch(Client.feature.inventory.invc_update_transfer_receipt, [authenticate], Controller.Client.InventoryController.updateTransferReceipt)

module.exports = router