const express = require('express')
const router = express.Router()
const controller = require('../app/controllers/Controller')
const middleware = require('../app/kernel')
const {Default} = require('./route')

// don't need token to access endpoint
router.get(Default.master.master_entity, controller.Default.MasterController.getEntity)
router.get(Default.master.master_location, controller.Default.MasterController.getLocation)
router.get(Default.master.master_payment_type, controller.Default.MasterController.getPaymentType)
router.get(Default.master.master_sales_program, [middleware.posAuthenticate], controller.Default.MasterController.getSalesProgram)
router.get(Default.master.master_payment_method, controller.Default.MasterController.getPaymentMethod)
router.get(Default.master.master_credit_terms, controller.Default.MasterController.getCreditTermsMstr)
// need token to access endpoint
router.get(Default.master.master_group, [middleware.authenticate], controller.Default.MasterController.getGroup)
router.get(Default.master.master_gender, [middleware.authenticate], controller.Default.MasterController.getGender)
router.get(Default.master.master_bp_type, [middleware.authenticate], controller.Default.MasterController.getBpType)
router.get(Default.master.master_citizen, [middleware.authenticate], controller.Default.MasterController.getCitizen)
router.get(Default.master.master_periode, [middleware.authenticate], controller.Default.MasterController.getPeriode)
router.get(Default.master.master_currency, [middleware.authenticate], controller.Default.MasterController.getCurrency)
router.get(Default.master.master_addr_type, [middleware.authenticate], controller.Default.MasterController.getAddrType)
router.get(Default.master.master_tax_invoice, [middleware.authenticate], controller.Default.MasterController.getTaxInvoice)
router.get(Default.master.master_blood_group, [middleware.authenticate], controller.Default.MasterController.getBloodGroup)
router.get(Default.master.master_contact_person, [middleware.authenticate], controller.Default.MasterController.getContactPerson)
router.get(Default.master.master_default_periode, [middleware.authenticate], controller.Default.MasterController.getDefaultPeriode)

module.exports = router