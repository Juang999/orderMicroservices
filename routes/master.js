const express = require('express')
const router = express.Router()
const controller = require('../app/controllers/Controller')
const middleware = require('../app/kernel')
const {Default} = require('./route')

// don't need token to access endpoint
router.get('/entity', controller.Default.MasterController.getEntity)
router.get('/location', controller.Default.MasterController.getLocation)
// router.post('/periode/input', controller.Default.MasterController.inputPeriode)
router.get('/payment-type', controller.Default.MasterController.getPaymentType)
router.get('/creditterms-mstr', controller.Default.MasterController.getCreditTermsMstr)
router.get('/payment-method', controller.Default.MasterController.getPaymentMethod)

// need token to access endpoint
router.get('/group', [middleware.authenticate], controller.Default.MasterController.getGroup)
router.get('/gender', [middleware.authenticate], controller.Default.MasterController.getGender)
router.get('/bp_type', [middleware.authenticate], controller.Default.MasterController.getBpType)
router.get('/citizen', [middleware.authenticate], controller.Default.MasterController.getCitizen)
router.get('/periode', [middleware.authenticate], controller.Default.MasterController.getPeriode)
router.get('/currency', [middleware.authenticate], controller.Default.MasterController.getCurrency)
router.get('/addr_type', [middleware.authenticate], controller.Default.MasterController.getAddrType)
router.get('/tax_invoice', [middleware.authenticate], controller.Default.MasterController.getTaxInvoice)
router.get('/blood_group', [middleware.authenticate], controller.Default.MasterController.getBloodGroup)
router.get('/contact_person', [middleware.authenticate], controller.Default.MasterController.getContactPerson)
router.get('/periode/default', [middleware.authenticate], controller.Default.MasterController.getDefaultPeriode)

// need POS token for authenticating
router.get('/sales-program', [middleware.posAuthenticate], controller.Default.MasterController.getSalesProgram)

module.exports = router