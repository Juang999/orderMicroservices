const {SqMstr, SqdDet, SiMstr, LocMstr, PtnrMstr, SoMstr, SoShipMstr, ArMstr, PiMstr} = require('../../models')
const {Op, Sequelize} = require('sequelize')
const helper = require('../../helper/helper')
const {v4: uuidv4} = require('uuid')
const moment = require('moment')

const SalesQuotationController = {
	getSite: (req, res) => {
		SiMstr.findAll({
			attributes: ['si_id', 'si_desc']
		})
			.then(result => {
				res.status(200)
					.json({
						status: 'berhasil',
						message: 'berhasil mengambil data si',
						data: result
					})
			})
			.catch(error => {
				res.status(400)
					.json({
						status: 'gagal',
						message: 'gagal mengambil data si',
						error: error.message
					})
			})
	},
	getLocationGit: (req, res) => {
		LocMstr.findAll({
			where: {
				loc_id: 100025
			},
			attributes: ['loc_id', 'loc_desc']
		})
			.then(result => {
				res.status(200)
					.json({
						status: 'berhasil',
						message: 'berhasil mengambil data',
						data: result
					})
			})
			.catch(err => {
				res.status(400)
					.json({
						status: 'gagal',
						message: 'gagal mengambil data',
						error: err.message
					})
			})
	},
	getLocation: (req, res) => {
		LocMstr.findAll({
			where: {
				loc_id: {
					[Op.in]: [10001, 1000122, 1000121, 10006, 1000191, 1000166, 100091]
				}
			},
			attributes: ['loc_id', 'loc_desc']
		})
			.then(result => {
				res.status(200)
					.json({
						status: 'berhasil',
						message: 'berhasil mengambil data',
						data: result
					})
			})
			.catch(err => {
				res.status(400)
					.json({
						status: 'gagal',
						message: 'gagal mengambil data',
						error: err.message
					})
			})
	},
	getLocationTo: (req, res) => {
		LocMstr.findAll({
			attributes: ['loc_id', 'loc_desc']
		})
			.then(result => {
				res.status(200)
					.json({
						status: 'berhasil',
						message: 'berhasil mengambil data lokasi',
						data: result
					})
			})
			.catch(err => {
				res.status(400)
					.json({
						status: 'gagal',
						message: 'gagal mengambil data lokasi',
						error: err.message
					})
			})
	},
	createSalesQuotation: async (req, res) => {
		try {
			let authUser = await helper.auth(req.get('authorization'))

			let partnerCustomer = await PtnrMstr.findOne({
				where: {
					ptnr_id: req.body.sq_ptnr_id_sold
				}
			})

			const sqCode = `SQ${authUser.detail_user.ptnr_en_id}0${moment().format('YYMM')}`

			let headerSalesQuotation = await SqMstr.create({
				sq_oid: uuidv4(),
				sq_dom_id: authUser.detail_user.ptnr_dom_id,
				sq_en_id: authUser.detail_user.ptnr_en_id,
				sq_add_by: authUser.usernama,
				sq_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
				sq_code: sqCode,
				sq_ptnr_id_sold: req.body.sq_ptnr_id_sold,
				sq_ptnr_id_bill: req.body.sq_ptnr_id_sold,
				sq_date: moment().format('YYYY-MM-DD'),
				sq_si_id: 992,
				sq_type: 'R',
				sq_sales_person: authUser.user_ptnr_id,
				sq_pi_id: req.body.sq_pi_id,
				sq_pay_type: req.body.sq_pay_type,
				sq_pay_method: req.body.sq_pay_method,
				sq_dp: 0,
				sq_disc_header: 0,
				sq_total: req.body.sq_total,
				sq_close_date: moment(req.body.sq_close_date).format('YYYY-MM-DD'),
				sq_trans_id: 'I',
				sq_trans_rmks: (req.body.sq_trans_rmks) ? req.body.sq_trans_rmks : null,
				sq_dt: moment().format('YYYY-MM-DD HH:mm:ss'),
				sq_cu_id: req.body.sq_cu_id,
				sq_total_ppn: 0,
				sq_total_pph: 0,
				sq_payment: 0,
				sq_exc_rate: req.body.sq_cu_id,  
				sq_tax_inc: null,
				sq_cons: req.body.sq_cons,
				sq_terbilang: req.body.sq_terbilang,
				sq_interval: 0,
				sq_need_date: moment(req.body.sq_need_date).format('YYYY-MM-DD'),
				sq_is_package: 'N',
				sq_sales_program: '-',
				sq_booking: 'N',
				sq_book_start_date: moment().format('YYYY-MM-DD'),
				sq_book_end_date: moment().format('YYYY-MM-DD'),
				sq_alocated: req.body.sq_alocated,
				sq_ptsfr_loc_id: req.body.sq_loc_id,
				sq_ptsfr_loc_to_id: req.body.sq_loc_to_id,
				sq_ptsfr_loc_git: req.body.sq_loc_git,
				sq_en_to_id: partnerCustomer.ptnr_en_id,
				sq_dropshipper: req.body.sq_is_dropshipper,
				sq_ship_to: (req.body.sq_is_dropshipper == 'Y' ) ? req.body.sq_ship_to : null
			})

			for (const bodySalesQuotation of JSON.parse(req.body.sq_body_sales_quotation)) {
				let countDetailProductSalesQuotation = await SqdDet.count({
					where: {
						sqd_sq_oid: headerSalesQuotation.sq_oid
					}
				})

				let sequenceDetailProductSalesQuotation = (countDetailProductSalesQuotation) ? countDetailProductSalesQuotation + 1 : 1
				
				await SqdDet.create({
					sqd_oid: uuidv4(),
					sqd_dom_id: headerSalesQuotation.sq_dom_id,
					sqd_en_id: headerSalesQuotation.sq_en_id,
					sqd_add_by: authUser.usernama,
					sqd_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
					sqd_sq_oid: headerSalesQuotation.sq_oid,
					sqd_seq: sequenceDetailProductSalesQuotation,
					sqd_is_additional_charge: 'N',
					sqd_si_id: headerSalesQuotation.sq_si_id,
					sqd_pt_id: bodySalesQuotation.sqd_pt_id,
					sqd_rmks: (bodySalesQuotation.sqd_rmks) ? bodySalesQuotation.sqd_rmks : null,
					sqd_qty: bodySalesQuotation.sqd_qty,
					sqd_qty_allocated: bodySalesQuotation.sqd_qty_allocated,
					sqd_qty_picked: bodySalesQuotation.sqd_qty_picked,
					sqd_qty_shipment: bodySalesQuotation.sqd_qty_shipment,
					sqd_qty_pending_inv: bodySalesQuotation.sqd_qty_pending_inv,
					sqd_qty_invoice: bodySalesQuotation.sqd_qty_invoice,
					sqd_um: bodySalesQuotation.sqd_um,
					sqd_cost: bodySalesQuotation.sqd_cost,
					sqd_price: bodySalesQuotation.sqd_price,
					sqd_disc: bodySalesQuotation.sqd_disc,
					sqd_sales_ac_id: bodySalesQuotation.sqd_sales_ac_id,
					sqd_sales_sb_id: bodySalesQuotation.sqd_sales_sb_id,
					sqd_sales_cc_id: bodySalesQuotation.sqd_sales_cc_id,
					sqd_disc_ac_id: bodySalesQuotation.sqd_disc_ac_id,
					sqd_um_conv: bodySalesQuotation.sqd_um_conv,
					sqd_qty_real: bodySalesQuotation.sqd_qty_real,
					sqd_taxable: bodySalesQuotation.sqd_taxable,
					sqd_tax_inc: bodySalesQuotation.sqd_tax_inc,
					sqd_tax_class: bodySalesQuotation.sqd_tax_class,
					sqd_status: bodySalesQuotation.sqd_status,
					sqd_dt: bodySalesQuotation.sqd_dt,
					sqd_payment: bodySalesQuotation.sqd_payment,
					sqd_dp: bodySalesQuotation.sqd_dp,
					sqd_sales_unit: bodySalesQuotation.sqd_sales_unit,
					sqd_loc_id: bodySalesQuotation.sqd_loc_id,
					sqd_serial: bodySalesQuotation.sqd_serial,
					sqd_qty_return: bodySalesQuotation.sqd_qty_return,
					sqd_ppn_type: bodySalesQuotation.sqd_ppn_type,
					sqd_pod_oid: bodySalesQuotation.sqd_pod_oid,
					sqd_qty_ir: bodySalesQuotation.sqd_qty_ir,
					sqd_invc_oid: bodySalesQuotation.sqd_invc_oid,
					sqd_invc_loc_id: bodySalesQuotation.sqd_invc_loc_id,
					sqd_need_date: bodySalesQuotation.sqd_need_date,
					sqd_qty_transfer_receipt: bodySalesQuotation.sqd_qty_transfer_receipt,
					sqd_qty_transfer_issue: bodySalesQuotation.sqd_qty_transfer_issue,
					sqd_total_amount_price: bodySalesQuotation.sqd_total_amount_price,
					sbd_qty_riud: bodySalesQuotation.sbd_qty_riud,
					sbd_qty_processed: bodySalesQuotation.sbd_qty_processed,
					sbd_qty_completed: bodySalesQuotation.sbd_qty_completed,
					sqd_qty_transfer: bodySalesQuotation.sqd_qty_transfer,
					sqd_qty_so: bodySalesQuotation.sqd_qty_so,
					sqd_qty_maxorder: bodySalesQuotation.sqd_qty_maxorder,
					sqd_commision: bodySalesQuotation.sqd_commision,
					sqd_commision_total: bodySalesQuotation.sqd_commision_total,
					sqd_sales_unit_total: bodySalesQuotation.sqd_sales_unit_total,
					sqd_sqd_oid: bodySalesQuotation.sqd_sqd_oid,
					sodas_sq_oid: bodySalesQuotation.sodas_sq_oid,
					sqd_qty_booking: bodySalesQuotation.sqd_qty_booking,
					sqd_qty_outs: bodySalesQuotation.sqd_qty_outs,
					sq_dropshipper: bodySalesQuotation.sq_dropshipper,
					sqd_invc_qty: bodySalesQuotation.sqd_invc_qty,
				})
			}

			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil membuat laporan sales quotation',
					data: headerSalesQuotation
				})
		} catch (error) {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal membuat laporan sales quotation',
					error: error.message,
					line: error.stack
				})
		}
	},
	getSalesQuotation: async (req, res) => {
		try {
			let authUser = await helper.auth(req.get('authorization'))

			let pageSalesQuotation = (req.query.page) ? req.query.page : 1
			let limitDataSalesQuotation = 10
			let offsetDataSalesQuotation = (pageSalesQuotation * limitDataSalesQuotation) - limitDataSalesQuotation

			let dataSalesQuotation = await SqMstr.findAll({
				where: {
					sq_sales_person: authUser.user_ptnr_id
				},
				attributes: ['sq_code'],
				limit: limitDataSalesQuotation,
				offset: offsetDataSalesQuotation,
				include: [
					{
						model: PtnrMstr,
						as: 'sold_to',
						attributes: ['ptnr_name']
					},{
						model: SoMstr,
						as: 'sales_order',
						attributes: ['so_date'],
						include: [
							{
								model: SoShipMstr,
								as: 'shipment',
								attributes: [
									[Sequelize.literal('to_char(soship_dt, \'YYYY-MM-DD\')'), 'soship_date'],
									'soship_code'
								]
							},{
								model: ArMstr,
								as: 'account_receivable',
								attributes: [['ar_code', 'ar_number'], 'ar_eff_date']
							}
						]
					}
				]
			})

			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil mengambil data sales quotation',
					sales_quotation_history: {data: dataSalesQuotation, page: pageSalesQuotation}
				})
		} catch (error) {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal mengambil data sales quotation',
					error: error.message
				})
		}
	},
	getPriceListGroupCustomer: async (req, res) => {
		try {
			var dataPriceListGroupCustomer = await PiMstr.findAll({
				where: {
					pi_ptnrg_id: req.params.partnerGroupId
				},
				attributes: ['pi_id', 'pi_desc']
			})

			if (dataPriceListGroupCustomer.length == 0) {
				var dataPriceListGroupCustomer = await PiMstr.findAll({
					where: {
						pi_ptnrg_id: 101
					},
					attributes: ['pi_id', 'pi_desc']
				})
			}

			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil mengambil data list harga',
					data: dataPriceListGroupCustomer
				})
		} catch (error) {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal mengambil data list harga',
					error: error.message
				})
		}
	}
}

module.exports = SalesQuotationController