const {SqMstr, SqdDet, SiMstr, LocMstr, PtnrMstr, SoMstr, SoShipMstr, ArMstr, PiMstr, sequelize, PtnrgGrp, AcMstr, PtMstr, PidDet, PiddDet, CodeMstr, InvcMstr} = require('../../models')
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
		
		let partnerCustomer = await PtnrMstr.findOne({
			where: {
				ptnr_id: req.body.sq_ptnr_id_sold
			}
		})

		let partnerGroup = await PtnrgGrp.findOne({
			where: {
				ptnrg_id: partnerCustomer.ptnr_ptnrg_id
			}
		})

		let debt = await ArMstr.findAll({
			where: {
				[Op.and]: {
					ar_bill_to: req.body.sq_ptnr_id_sold,
					ar_amount: {
						[Op.gt]: Sequelize.col('ar_pay_amount')
					}
				}
			},
			attributes: [[Sequelize.fn('sum', Sequelize.literal('ar_amount - ar_pay_amount')), 'debt_total']]
		})

		let total = debt.debt_total + req.body.sq_total

		if (partnerCustomer.ptnr_limit_credit > 0) {
			if ( total >= partnerCustomer.ptnr_limit_credit) {
				res.status(400)
					.json({
						status: 'gagal',
						error: 'total dari pembelian barang dan piutangmu melebihi limit'
					})
				
				return
			}
		}

		if (partnerGroup.ptnrg_limit_credit  > 0) {
			if (total >= partnerGroup.ptnrg_limit_credit) {
				res.status(400)
					.json({
						status: 'gagal',
						error: 'total dari pembelian barang dan piutangmu melebihi limit'
					})
	
				return
			}
		}

		let transaction
		
		try {
			transaction = await sequelize.transaction()

			let authUser = await helper.auth(req.get('authorization'))


			let countDataSQ = await SqMstr.count()

			const sqCode = `SQ${authUser.detail_user.ptnr_en_id}0${moment().format('MMYY')}00${countDataSQ + 1}`

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
				sq_trans_id: 'D',
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

			let convertToJson = JSON.parse(req.body.sq_body_sales_quotation)

			for (const bodySalesQuotation of convertToJson) {
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
					sqd_si_id: 992,
					sqd_pt_id: bodySalesQuotation.sqd_pt_id,
					sqd_rmks: (bodySalesQuotation.sqd_rmks) ? bodySalesQuotation.sqd_rmks : null,
					sqd_qty: bodySalesQuotation.sqd_qty,
					sqd_qty_booking: bodySalesQuotation.sqd_qty_booking,
					sqd_loc_id: bodySalesQuotation.sqd_loc_id,
					sqd_cost: bodySalesQuotation.sqd_cost,
					sqd_price: bodySalesQuotation.sqd_price,
					sqd_sales_ac_id: bodySalesQuotation.sqd_sales_ac_id,
					sqd_sales_sb_id: 0,
					sqd_sales_cc_id: 0,
					sqd_um_conv: bodySalesQuotation.sqd_um_conv,
					sqd_taxable: bodySalesQuotation.sqd_taxable,
					sqd_tax_inc: bodySalesQuotation.sqd_tax_inc,
					sqd_tax_class: bodySalesQuotation.sqd_tax_class,
					sqd_dt: moment().format('YYYY-MM-DD HH:mm:ss'),
					sqd_payment: 0,
					sqd_dp: 0,
					sqd_sales_unit: 0,
				})
			}

			await transaction.commit();

			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil membuat laporan sales quotation',
					data: headerSalesQuotation
				})
		} catch (error) {
			await transaction.rollback();

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
	},
	getDebtCustomer: (req, res) => {
		ArMstr.findAll({
			where: {
				ar_bill_to: req.params.ptnrId
			},
			order: [['ar_date', 'desc']],
			attributes: ['ar_date', 'ar_amount', 'ar_pay_amount']
		})
		.then(result => {
			for (const detailResult of result) {
				if (detailResult.ar_amount - detailResult.ar_pay_amount == 0) {
					detailResult.dataValues.ar_status = 'Lunas'
				} else {
					detailResult.dataValues.ar_status = 'Belum Lunas'
				}
			}

			return result
		})
		.then(result => {
			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil mengambil data hutang',
					data: result
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal mengambil data hutang',
					error: err.message
				})
		})
	},
	sumDebtCustomer: (req, res) => {
		ArMstr.findAll({
			where: {
				[Op.and]: {
					ar_bill_to: req.params.ptnrId,
					ar_amount: {
						[Op.gt]: Sequelize.col('ar_pay_amount')
					}
				}
			},
			attributes: [[Sequelize.fn('sum', Sequelize.literal('ar_amount - ar_pay_amount')), 'debt_total']]
		})
		.then(result => {
			result[0].dataValues.debt_total = (result[0].dataValues.debt_total == null) ? 0 : result[0].dataValues.debt_total

			return result
		})
		.then(result => {
			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil mengambil jumlah hutang',
					data: result,
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal mengambil jumlah hutang',
					error: err.message
				})
		})
	},
	getLimitCreditCustomer: async (req, res) => {
		try {
			var limitCredit
			
			limitCredit = await PtnrMstr.findOne({
				where: {
					ptnr_id: req.params.ptnrId
				},
				attributes: [
					['ptnr_limit_credit', 'limit_credit'],
					['ptnr_ptnrg_id', 'ptnrg_id']
				]
			})

			if (limitCredit.dataValues.limit_credit == 0 || limitCredit.dataValues.limit_credit == null) {
				limitCredit = await PtnrgGrp.findOne({
					where: {
						ptnrg_id: limitCredit.dataValues.ptnrg_id
					},
					attributes: [
						['ptnrg_limit_credit', 'limit_credit']
					]
				})
			}

			let dataLimitCredit = {
				limit_credit: (limitCredit.dataValues.limit_credit == null) ? 0 : limitCredit.dataValues.limit_credit,
				status: (limitCredit.dataValues.limit_credit == null || limitCredit.dataValues.limit_credit == 0) ? 'UNLIMITED' : 'LIMITED'
			}

			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil mengambil data batas kredit pengguna',
					data: dataLimitCredit
				})
		} catch (error) {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal mengambil data batas kredit barang pengguna',
					error: error.message
				})
		}
	},
	getAccount: (req, res) => {
		AcMstr.findAll({
			attributes: ['ac_id', 'ac_name']
		})
		.then(result => {
			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil mengambil data akun',
					data: result
				})
		})
		.catch(err => {
			console.log(err)
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal mengambil data akun',
					error: err.message
				})
		})
	},
	getProduct: async (req, res) => {
		try {
			let where = {
				pt_id: {
					[Op.in]: Sequelize.literal(`(SELECT pid_pt_id FROM public.pid_det)`)
				}
			}

			if (req.query.query != 'undefined') {where.pt_desc1 = {[Op.like]: `%${req.query.query}%`}}

			let dataCustomer = await PtnrMstr.findOne({
				where: {
					ptnr_id: req.params.ptnrId
				},
				attributes: ['ptnr_ptnrg_id']
			}) 
	
			let pageProduct = (req.query.page) ? req.query.page : 1
			let limitProduct = 10
			let offsetProduct = (pageProduct * limitProduct) - limitProduct
			
			let dataProduct = await PtMstr.findAll({
				attributes: ['pt_id', 'pt_code', 'pt_desc1', 'pt_desc2', 'pt_clothes_id'],
				where: where,
				limit: limitProduct,
				offset: offsetProduct,
				order: [['pt_clothes_id', 'asc']],
				include: [
					{
						model: PidDet,
						as: 'price',
						attributes: ['pid_pt_id', 'pid_pi_oid'],
						where: {
							pid_pi_oid: {
								[Op.in]: Sequelize.literal(`(SELECT pi_oid FROM public.pi_mstr WHERE pi_ptnrg_id = ${dataCustomer.dataValues.ptnr_ptnrg_id})`)
							}
						},
						include: [
							{
								model: PiMstr,
								as: 'price_list',
								attributes: ['pi_oid', 'pi_desc']
							}, {
								model: PiddDet,
								as: 'detail_price',
								attributes: ['pidd_price', 'pidd_disc'],
								include: [
									{
										model: CodeMstr,
										as: 'PaymentType',
										attributes: ['code_name']
									}
								]
							}
						]
					}, {
						model: InvcMstr,
						as: 'Qty',
						attributes: ['invc_qty_available'],
						where: {
							invc_loc_id: {
								[Op.in]: [10001, 200010, 300018]
							}
						},
						include: [
							{
								model: LocMstr,
								as: 'location',
								attributes: ['loc_id', 'loc_desc']
							}
						]
					}
				]
			})

			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil mengambil data',
					data: dataProduct
				})
		} catch (error) {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal mengambil data produk',
					error: error.message
				})
		}
	}
}

module.exports = SalesQuotationController