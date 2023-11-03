const {
	PiMstr, PidDet, 
	SqMstr, SqdDet, 
	PsMstr, PsdDet,
	SiMstr, LocMstr, 
	PtnrMstr, ArMstr, 
	PtMstr, CodeMstr, 
	AreaMstr, EnMstr,
	Sequelize,PiddDet, 
	SoMstr, SoShipMstr, 
	sequelize, PtnrgGrp, 
	InvcMstr, InvctTable, 
} = require('../../../models')
const {Op, SequelizeScopeError} = require('sequelize')
const helper = require('../../../helper/helper')
const {v4: uuidv4} = require('uuid')
const moment = require('moment')

class SalesQuotationController {
	getSite = (req, res) => {
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
	}

	getLocation = (req, res) => {
		let locId = (req.params.en_id) ? [req.params.en_id] : [10001, 200010, 300018]

		LocMstr.findAll({
			attributes: ['loc_id', 'loc_desc'],
			where: {
				loc_id: {
					[Op.in]: locId
				}
			},
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
	}

	getLocationGit = (req, res) => {
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
	}

	getSalesQuotation = async (req, res) => {
		try {
			// variable to get data user
			let authUser = await helper.auth(req.get('authorization'))
			
			// operation to get limit and offset data
			let {page, limit, offset} = helper.page(req.query.page, 10)
		
			// get dadta SQ
			let dataSalesQuotation = await SqMstr.findAll({
				attributes: [
					'sq_code',
					[Sequelize.col('sold_to.ptnr_name'), 'customer_name'],
					[Sequelize.col("sales_order.so_date"), 'so_date'],
					[Sequelize.col('sales_order.so_code'), 'so_number'],
					[Sequelize.col('sales_order.shipment.soship_code'), 'shipment_number'],
					[Sequelize.literal('to_char("sales_order->shipment"."soship_dt", \'YYYY-MM-DD\')'), 'shipment_date'],
					[Sequelize.col('sales_order.account_receivable.ar_date'), 'dr/cr_memo_date'],
					[Sequelize.col('sales_order.account_receivable.ar_amount'), 'dr/cr_memo_number'],
					[Sequelize.col('sales_order.account_receivable.ar_due_date'), 'dr/cr_due_date'],
					[Sequelize.col('sales_order.account_receivable.ar_code'), 'ar_number'], 
					[Sequelize.col('sales_order.account_receivable.ar_eff_date'), 'ar_payment']
					],
				include: [
					{
						model: PtnrMstr,
						as: 'sold_to',
						attributes: [],
						required: true,
						duplicating: false
					},
					{
						model: SoMstr,
						as: 'sales_order',
						attributes: [],
						include: [
							{
								model: SoShipMstr,
								as: 'shipment',
								required: true,
								duplicating: false,
								attributes: []
							},
							{
								model: ArMstr,
								as: 'account_receivable',
								required: true,
								duplicating: false,
								attributes: []
							}
						]
					}
				],
				where: {
					sq_sales_person: authUser.user_ptnr_id
				},
				limit: limit,
				offset: offset,
			})
	
			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil mengambil data sales quotation',
					sales_quotation_history: {data: dataSalesQuotation, page: page}
				})
		} catch (error) {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal mengambil data sales quotation',
					error: error.message
				})
		}
	}

	getPriceListGroupCustomer = async (req, res) => {
		PiMstr.findAll({
			attributes: [
					'pi_oid', 
					'pi_ptnrg_id', 
					'pi_id', 
					'pi_desc'
				]
		})
		.then(result => {
			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil mengambil data list harga',
					data: result
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal mengambil data list harga',
					error: err.message
				})
		})
	}

	getProduct = (req, res) => {
			let pageQuery = (req.query.page) ? req.query.page : 1
			let {limit, offset} = helper.page(pageQuery, 6)

			PtMstr.findAll({
				attributes: [
					'pt_id', 
					'pt_code', 
					'pt_desc1', 
					'pt_clothes_id',
					'pt_code',
					[Sequelize.col('Qty.invc_oid'), 'invc_oid'],
					[Sequelize.col('Qty.invc_qty_available'), 'qty_product'],
					[Sequelize.literal('"price->detail_price"."pidd_price"'), 'price_product'],
					[Sequelize.fn('ROUND', Sequelize.literal('"price->detail_price"."pidd_disc"'), '2'), 'discount_product'],
				],
				include: [
					{
						model: InvcMstr,
						as: 'Qty',
						required: true,
						duplicating: false,
						attributes: []
					}, {
						model: PidDet,
						as: 'price',
						required: true,
						duplicating: false,
						attributes: [],
						include: [
							{
								model: PiddDet,
								as: 'detail_price',
								required: true,
								duplicating: false,
								attributes: []
							}
						]
					}
				],
				where: {
					[Op.and]: [
						Sequelize.where(Sequelize.col('pt_id'), {
							[Op.in]: Sequelize.literal(`(SELECT invc_pt_id FROM public.invc_mstr WHERE invc_loc_id = ${req.params.locId})`)
						}),
						Sequelize.where(Sequelize.col('pt_id'), {
							[Op.in]: Sequelize.literal(`(SELECT pid_pt_id FROM public.pid_det WHERE pid_pi_oid = '${req.params.pricelistOid}' AND pid_oid IN (SELECT pidd_pid_oid FROM public.pidd_det WHERE pidd_area_id = ${req.params.areaId}))`)
						}),
						Sequelize.where(Sequelize.col('Qty.invc_loc_id'), {
							[Op.eq]: req.params.locId
						}),
						Sequelize.where(Sequelize.col('price->detail_price.pidd_area_id'), {
							[Op.eq]: req.params.areaId
						}),
						Sequelize.where(Sequelize.col('price->detail_price.pidd_payment_type'), {
							[Op.eq]: 9942
						}),
					]
				},
				limit: limit,
				offset: offset,
				order: [['pt_desc1', 'asc']],
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
						message: 'gagal mengambil data produk',
						error: err.message
					})
			})
	}

	getLimitCreditCustomer = async (req, res) => {
		PtnrMstr.findOne({
			attributes: [
					'ptnr_id',
					'ptnr_name',
					[Sequelize.literal('CASE WHEN ptnr_limit_credit = 0 THEN ptnr_group.ptnrg_limit_credit ELSE ptnr_limit_credit END'), 'limit_credit'],
				],
			include: [
					{
						model: PtnrgGrp,
						as: 'ptnr_group',
						required: true,
						duplicating: false,
						attributes: []
					}
				],
			where: {
				ptnr_id: req.params.ptnrId
			}
		})
		.then(result => {
				res.status(200)
					.json({
						status: 'berhasil',
						message: 'berhasil mengambil data batas kredit pengguna',
						data: result
					})
		})
		.catch(err => {
				res.status(400)
					.json({
						status: 'gagal',
						message: 'gagal mengambil data batas kredit barang pengguna',
						error: err.message
					})
		})
	}

	sumDebtCustomer = (req, res) => {
		ArMstr.findAll({
			attributes: [[Sequelize.literal('CASE WHEN sum(ar_amount - ar_pay_amount) <> 0 THEN sum(ar_amount - ar_pay_amount) ELSE 0 END'), 'debt_total']],
			where: {
				ar_bill_to: req.params.ptnrId,
				ar_amount: {
					[Op.gt]: Sequelize.col('ar_pay_amount')
				}
			},
		})
		.then(result => {
			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil mengambil jumlah hutang',
					data: result[0],
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
	}

	createSalesQuotation = async (req, res) => {
		// transactionVariable
		let transaction
	
		try {
			// start transaction
			transaction = await sequelize.transaction()
			// userAccount and get customer data
			let authUser = await helper.auth(req.get('authorization'))

			// start checkLimitDebtCustomer
			let checkDebt = await this.checkDebtCustomer({
				ptnrId: req.body.sq_ptnr_id_sold, 	
				sqTotal: req.body.sq_total,
			})

			if (checkDebt['status'] == true) {
				res.status(400)
					.json({
						status: 'total pembelian melebihi credit limuit',
						data: null,
						error: null
					})
			}
			// end check debt customer
	
			// startTransaction, count data SQ, and create sqCode
			let countDataSQ = await SqMstr.count()
			const sqCode = `SQ${authUser.detail_user.ptnr_en_id}0${moment().format('MMYY')}00${countDataSQ + 1}`

			let headerSalesQuotation = await SqMstr.create({
				sq_oid: uuidv4(),
				sq_dom_id: authUser.detail_user.ptnr_dom_id,
				sq_en_id: authUser.detail_user.ptnr_en_id,
				sq_add_by: authUser.usernama,
				sq_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
				sq_code: sqCode,
				sq_ptnr_id_sold: parseInt(req.body.sq_ptnr_id_sold),
				sq_ptnr_id_bill: parseInt(req.body.sq_ptnr_id_sold),
				sq_date: moment().format('YYYY-MM-DD'),
				sq_si_id: 992,
				sq_type: 'R',
				sq_sales_person: authUser.user_ptnr_id,
				sq_pi_id: req.body.sq_pi_id,
				sq_pay_type: 9942,
				sq_pay_method: parseInt(req.body.sq_pay_method),
				sq_dp: 0,
				sq_disc_header: 0,
				sq_total: parseInt(req.body.sq_total),
				sq_due_date: moment().format('YYYY-MM-DD'),
				sq_close_date: moment().add(3, 'days').format('YYYY-MM-DD'),
				sq_trans_id: 'D',
				sq_trans_rmks: (req.body.sq_trans_rmks) ? req.body.sq_trans_rmks : null,
				sq_dt: moment().format('YYYY-MM-DD HH:mm:ss'),
				sq_cu_id: 1,
				sq_total_ppn: 0,
				sq_total_pph: 0,
				sq_payment: 0,
				sq_exc_rate: parseInt(req.body.sq_cu_id),  
				sq_tax_inc: null,
				sq_cons: req.body.sq_cons,
				sq_terbilang: req.body.sq_terbilang,
				sq_credit_term: req.body.sq_credit_term,
				sq_interval: 0,
				sq_ar_ac_id: 13,
				sq_ar_sb_id: 0,
				sq_ar_cc_id: 0,
				sq_need_date: moment(req.body.sq_need_date).format('YYYY-MM-DD'),
				sq_is_package: 'N',
				sq_sales_program: '-',
				sq_booking: req.body.sq_booking,
				sq_book_start_date: moment(req.body.sq_start_date).format('YYYY-MM-DD'),
				sq_book_end_date: moment(req.body.sq_end_date).format('YYYY-MM-DD'),
				sq_alocated: req.body.sq_alocated,
				sq_ptsfr_loc_id: parseInt(req.body.sq_loc_id),
				sq_ptsfr_loc_to_id: 10001,
				sq_ptsfr_loc_git: 10004,
				sq_en_to_id: checkDebt['ptnr_en_id'],
				sq_dropshipper: req.body.sq_is_dropshipper,
				sq_ship_to: (req.body.sq_is_dropshipper == 'Y' ) ? req.body.sq_ship_to : null
			}, {
				logging: async (sql, queryObject) => {
					// value ada 45
					let value = queryObject.bind
					await helper.Query.insert(sql, {
						bind: {
							$1: value[0],
							$2: value[1],
							$3: value[2],
							$4: value[3],
							$5: value[4],
							$6: value[5],
							$7: value[6],
							$8: value[7],
							$9: value[8],
							$10: value[9],
							$11: value[10],
							$12: value[11],
							$13: value[12],
							$14: value[13],
							$15: value[14],
							$16: value[15],
							$17: value[16],
							$18: value[17],
							$19: value[18],
							$20: value[19],
							$21: value[20],
							$22: value[21],
							$23: value[22],
							$24: value[23],
							$25: value[24],
							$26: value[25],
							$27: value[26],
							$28: value[27],
							$29: value[28],
							$30: value[29],
							$31: value[30],
							$32: value[31],
							$33: value[32],
							$34: value[33],
							$35: value[34],
							$36: value[35],
							$37: value[36],
							$38: value[37],
							$39: value[38],
							$40: value[39],
							$41: value[40],
							$42: value[41],
							$43: value[42],
							$44: value[43],
							$45: value[44],
						}
					})
				}
			})
	
			// inputProductToTable: public.sqd_det	
			await this.inputProductToDetailSalesQuotation({
				bodySQ: req.body.sq_body_sales_quotation,
				sqOid: headerSalesQuotation.sq_oid,
				sqDomId: headerSalesQuotation.sq_dom_id,
				sqEnId: headerSalesQuotation.sq_en_id,
				userName: authUser.usernama,
				accountInformation: {
					ar_ac_id: headerSalesQuotation.sq_ar_ac_id,
					ar_sb_id: headerSalesQuotation.sq_ar_sb_id
				},
				isBooking: req.body.sq_booking
			})
	
			// commitTransaction
			await transaction.commit()
			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil membuat laporan sales quotation',
					data: headerSalesQuotation
				})
		} catch (error) {
			// rollbackTransaction
			await transaction.rollback()
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal membuat laporan sales quotation',
					error: error.message,
					line: error.stack
				})
		}
	}

	checkDebtCustomer = async (dataCheck) => {
		let partnerCustomer = await PtnrMstr.findOne({
			attributes: [
					'ptnr_en_id',
					[Sequelize.literal('CASE WHEN ptnr_limit_credit = 0 THEN ptnr_group.ptnrg_limit_credit END'), 'limit_credit']
				],
			include: [
					{
						model: PtnrgGrp,
						as: 'ptnr_group',
						attributes: []	
					}
				]
		})

		let debt = await ArMstr.findAll({
			where: {
				[Op.and]: {
					ar_bill_to: dataCheck.ptnrId,
					ar_amount: {
						[Op.gt]: Sequelize.col('ar_pay_amount')
					}
				}
			},
			attributes: [[Sequelize.fn('sum', Sequelize.literal('ar_amount - ar_pay_amount')), 'debt_total']]
		})

		let totalLimit = partnerCustomer['dataValues']['limit_credit']
		let totalDebt = debt[0]['dataValues']['debt_total']
	
		return (totalLimit != 0 && dataCheck.sqTotal + totalDebt >= totalLimit) ? {status: true, ptnr_en_id: partnerCustomer['dataValues']['ptnr_en_id']} 
																				: {status: false, ptnr_en_id: partnerCustomer['dataValues']['ptnr_en_id']}
	}

	inputProductToDetailSalesQuotation = async (data) => {
		let convertToJson = JSON.parse(data.bodySQ)
		let sequence = 1

		for (const bodySalesQuotation of convertToJson) {
			let costProductSalesQuotation = await this.getInvctTable(bodySalesQuotation.sqd_pt_id)
			let unitMeasureProduct = await this.getUnitMeasureProduct(bodySalesQuotation.sqd_pt_id)

			if (data.isBooking == 'Y') {
				await this.updateStockProduct({
					sqdPtId: bodySalesQuotation.sqd_pt_id,
					sqdLocId: bodySalesQuotation.sqd_loc_id,
					sqdQtyBooking: bodySalesQuotation.sqd_qty_booking
				})
			}

			bodySalesQuotation['sqd_oid'] = uuidv4()
			bodySalesQuotation['sqd_dom_id'] = data['sqDomId']
			bodySalesQuotation['sqd_en_id'] = data['sqEnId']
			bodySalesQuotation['sqd_add_by'] = data['userName']
			bodySalesQuotation['sqd_add_date'] = moment().format('YYYY-MM-DD HH:mm:ss')
			bodySalesQuotation['sqd_sq_oid'] = data['sqOid']
			bodySalesQuotation['sqd_seq'] = parseInt(sequence)
			bodySalesQuotation['sqd_is_additional_charge'] = 'N'
			bodySalesQuotation['sqd_si_id'] = 992
			bodySalesQuotation['sqd_pt_id'] = bodySalesQuotation['sqd_pt_id']
			bodySalesQuotation['sqd_rmks'] = ''
			bodySalesQuotation['sqd_qty_booking'] = (data['isBooking']) ? bodySalesQuotation.sqd_qty : 0
			bodySalesQuotation['sqd_sales_ac_id'] = 13
			bodySalesQuotation['sqd_sales_sb_id'] = 0
			bodySalesQuotation['sqd_sales_cc_id'] = 0
			bodySalesQuotation['sqd_um_conv'] = 1
			bodySalesQuotation['sqd_taxable'] = 'N'
			bodySalesQuotation['sqd_tax_inc'] = 'N'
			bodySalesQuotation['sqd_tax_class'] = 9949
			bodySalesQuotation['sqd_dt'] = moment().format('YYYY-MM-DD HH:mm:ss')
			bodySalesQuotation['sqd_payment'] = 0
			bodySalesQuotation['sqd_dp'] = 0
			bodySalesQuotation['sqd_sales_unit'] = 0
			bodySalesQuotation['sqd_cost'] = costProductSalesQuotation['invct_cost']
			bodySalesQuotation['sqd_um'] = unitMeasureProduct['pt_um']

			sequence += 1
		}

		await SqdDet.bulkCreate(convertToJson, {
			logging: async (sql) => {
				await helper.Query.queryBulkCreate(sql)
			}
		})
	}

	updateStockProduct = async (dataUpdateQty) => {
		let where = {
			invc_pt_id: dataUpdateQty.sqdPtId,
			invc_loc_id: dataUpdateQty.sqdLocId
		}
	
		let qtyProduct = await InvcMstr.findOne({
			where: where,
			attributes: ['invc_qty_available', 'invc_qty_booked']
		})
	
		await InvcMstr.update({
			invc_qty_available: qtyProduct.invc_qty_available - dataUpdateQty.sqdQtyBooking,
			invc_qty_booked: qtyProduct.invc_qty_booked + dataUpdateQty.sqdQtyBooking
		}, {
			where: where
		})
	}

	getInvctTable = async (pt_id) => {
		let costProduct = await InvctTable.findOne({
			where: {invct_pt_id: pt_id},
			attributes: ['invct_cost']
		})
	
		return costProduct
	}

	countDetailSalesQuotation = async (sqOid) => {
		let countData = await SqdDet.count({
			where: {sqd_sq_oid: sqOid}
		})
	
		return countData
	}

	getUnitMeasureProduct = async (ptId) => {
		let unitMeasureProduct = await PtMstr.findOne({
			where: {pt_id: ptId},
			attributes: ['pt_um']
		})
	
	
		return unitMeasureProduct
	}

	getPackage = (req, res) => {
		let en_id = (req.query.entity) ? [req.query.entity] : [1, 2, 3]

		PsMstr.findAll({
			attributes: [
				'ps_oid',
				[Sequelize.col('entity_package.en_desc'), 'entity'],
				'ps_par',
				'ps_desc',
			],
			include: [
				{
					model: EnMstr,
					as: 'entity_package',
					attributes: []
				}
			],
			where: {
				ps_en_id: {
					[Op.in]: en_id
				}
			},
			group: [
				'ps_oid',
				'entity',
				'ps_par',
				'ps_desc'
			]
		})
		.then(result => {
			res.status(200)
				.json({
					status: 'success',
					data: result,
					error: null
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					data: null,
					error: err.message
				})
		})
	}

	getDetailPackage = (req, res) => {
		let page = (req.query.page) ? req.query.page : 1
		let limitPage = (req.query.limit) ? req.query.limit : 10
		let {limit, offset} = helper.page(page, limitPage)

		PsdDet.findAll({
			attributes: [
				[Sequelize.col('detail_product.pt_id'), 'pt_id'],
				[Sequelize.col('detail_product.pt_code'), 'pt_code'],
				[Sequelize.col('detail_product.pt_desc1'), 'pt_desc1'],
				[Sequelize.col('detail_product.pt_clothes_id'), 'pt_clothes_id'],
				['psd_qty', 'qty_product'],
				[Sequelize.literal('"detail_product->Qty"."invc_oid"'), 'invc_oid'],
				[Sequelize.literal('"detail_product->price->detail_price"."pidd_price"'), 'price_product'],
				[Sequelize.fn('ROUND', Sequelize.literal('"detail_product->price->detail_price"."pidd_disc"'), '2'), 'discount_product'],
			],
			include: [
				{
					model: PtMstr,
					as: 'detail_product',
					attributes: [],
					include: [
						{
							model: InvcMstr,
							as: 'Qty',
							required: true,
							duplicating: false,
							attributes: []
						}, {
							model: PidDet,
							as: 'price',
							required: true,
							duplicating: false,
							attributes: [],
							include: [
								{
									model: PiddDet,
									as: 'detail_price',
									required: true,
									duplicating: false,
									attributes: []
								}
							]
						}
					]
				}
			],
			where: {
				[Op.and]: [
					Sequelize.where(Sequelize.col('psd_ps_oid'), {
						[Op.eq]: req.params.package_oid
					}),
					Sequelize.where(Sequelize.literal('"detail_product->price"."pid_pi_oid"'), {
						[Op.eq]: req.query.price_oid
					})
				],
				psd_ps_oid: req.params.package_oid,
				[Op.or]: {
					[Op.and]: [
						Sequelize.where(Sequelize.literal('"detail_product->Qty"."invc_en_id"'), {
							[Op.eq]: 1
						}),
						Sequelize.where(Sequelize.literal('"detail_product->Qty"."invc_loc_id"'), {
							[Op.eq]: 10001
						})
					], 
					[Op.and]: [
						Sequelize.where(Sequelize.literal('"detail_product->Qty"."invc_en_id"'), {
							[Op.eq]: 2
						}),
						Sequelize.where(Sequelize.literal('"detail_product->Qty"."invc_loc_id"'), {
							[Op.eq]: 200010
						})
					],
					[Op.and]: [
						Sequelize.where(Sequelize.literal('"detail_product->Qty"."invc_en_id"'), {
							[Op.eq]: 3
						}),
						Sequelize.where(Sequelize.literal('"detail_product->Qty"."invc_loc_id"'), {
							[Op.eq]: 300018
						})
					]
				}
			},
			limit: limit,
			offset: offset
		})
		.then(result => {
			res.status(200)
				.json({
					status: 'success',
					data: result,
					error: null
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					data: null,
					error: err.message
				})
		})
	}
}

module.exports = new SalesQuotationController()