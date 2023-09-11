const {
	SqMstr, 
	SqdDet, 
	SiMstr, 
	LocMstr, 
	PtnrMstr, 
	SoMstr, 
	SoShipMstr, 
	ArMstr, 
	PiMstr, 
	sequelize, 
	PtnrgGrp, 
	PtMstr, 
	PidDet, 
	PiddDet, 
	CodeMstr, 
	InvcMstr, 
	InvctTable, 
	AreaMstr
} = require('../../../models')
const {Op, Sequelize} = require('sequelize')
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
		let locId

		switch (req.params.en_id) {
			case "1":
				locId = [10001]
				break;

			case "2":
				locId = [200010]
				break;

			case "3":
				locId = [300018]
				break;

			default:
				locId = [10001, 200010, 300018]
				break;
		}

		LocMstr.findAll({
			where: {
				loc_id: {
					[Op.in]: locId
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
			let authUser = await helper.auth(req.get('authorization'))
		
			let {page, limit, offset} = helper.page(req.query.page, 10)
		
			let dataSalesQuotation = await SqMstr.findAll({
				where: {
					sq_sales_person: authUser.user_ptnr_id
				},
				attributes: ['sq_code'],
				limit: limit,
				offset: offset,
				include: [
					{
						model: PtnrMstr,
						as: 'sold_to',
						attributes: ['ptnr_name']
					},{
						model: SoMstr,
						as: 'sales_order',
						attributes: ['so_date', ['so_code', 'so_number']],
						include: [
							{
								model: SoShipMstr,
								as: 'shipment',
								attributes: [
									[Sequelize.literal('to_char(soship_dt, \'YYYY-MM-DD\')'), 'shipment_date'],
									['soship_code', 'shipment_number']
								]
							},{
								model: ArMstr,
								as: 'account_receivable',
								attributes: [
									['ar_date', 'dr/cr_memo_date'],
									['ar_amount', 'dr/cr_memo_number'],
									['ar_due_date', 'dr/cr_due_date'],
									['ar_code', 'ar_number'], 
									['ar_eff_date', 'ar_payment']
								]
							}
						]
					}
				]
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
			where: {
				pi_ptnrg_id: req.params.partnerGroupId
			},
			attributes: ['pi_oid', 'pi_ptnrg_id', 'pi_id', 'pi_desc']
		})
			.then(async result => {
				if (result.length == 0) {
					result = await PiMstr.findAll({
						where: {
							pi_ptnrg_id: 101
						},
						attributes: ['pi_oid', 'pi_ptnrg_id', 'pi_id', 'pi_desc']
					})
				}
	
				return result
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

	getProduct = async (req, res) => {
		if (req.query.query) {where.pt_desc1 = {[Op.like]: `%${req.query.query}%`}}
	
		let pageQuery = (req.query.page) ? req.query.page : 1
		let {limit, offset} = helper.page(pageQuery, 10)
	
		PtMstr.findAll({
			attributes: [
				'pt_id', 
				'pt_code', 
				'pt_desc1', 
				'pt_clothes_id',
				[Sequelize.col('price->detail_price.pidd_price'), 'price'],
				[Sequelize.fn('ROUND', Sequelize.col('price->detail_price.pidd_disc'), 2), 'discount'],
				[Sequelize.col('Qty.invc_qty_available'), 'qty']
			],
			offset: offset,
			limit: limit,
			order: [['pt_clothes_id', 'asc']],
			include: [
				{
					model: PidDet,
					as: 'price',
					attributes: [],
					required: true,
					duplicating: false,
					include: [
						{
							model: PiddDet,
							as: 'detail_price',
							attributes: [],
							required: true,
							duplicating: false,
						}
					]
				}, 
				{
					model: InvcMstr,
					as: 'Qty',
					required: true,
					duplicating: false,
					attributes: [],
				}
			],
			where: {
				[Op.and]: [
					Sequelize.where(Sequelize.col('Qty.invc_loc_id'), {
						[Op.eq]: req.params.locId
					}),
					Sequelize.where(Sequelize.col('price.pid_pi_oid'), {
						[Op.eq]: req.params.pricelistOid
					}),
					Sequelize.where(Sequelize.col('pt_desc1'), {
						[Op.iLike]: `%${(req.query.query) ? req.query.query : ''}%`
					}),
					Sequelize.where(Sequelize.col('price->detail_price.pidd_payment_type'), {
						[Op.eq]: 9942
					}),
					Sequelize.where(Sequelize.col('pt_id'), {
						[Op.in]: Sequelize.literal(`(SELECT invc_pt_id FROM public.invc_mstr WHERE invc_loc_id = ${req.params.locId})`)
					}),
					Sequelize.where(Sequelize.col('price.pid_oid'), {
						[Op.in]: Sequelize.literal(`(SELECT pidd_pid_oid FROM public.pidd_det WHERE pidd_area_id = ${req.params.areaId})`)
					}),
					Sequelize.where(Sequelize.col('pt_id'), {
						[Op.in]: Sequelize.literal(`(SELECT pid_pt_id FROM public.pid_det WHERE pid_pi_oid = '${req.params.pricelistOid}' AND pid_oid IN (SELECT pidd_pid_oid FROM public.pidd_det WHERE pidd_area_id = ${req.params.areaId}))`)
					}),
				]
			}
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
	}

	sumDebtCustomer = (req, res) => {
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
	}

	createSalesQuotation = async (req, res) => {
		// transactionVariable
		let transaction
	
		try {
			// userAccount and get customer data
			let authUser = await helper.auth(req.get('authorization'))
			let partnerCustomer = await PtnrMstr.findOne({
				where: {
					ptnr_id: req.body.sq_ptnr_id_sold
				}
			})
	
			// checkLimitDebtCustomer
			let dataCheck = {
				ptnrId: partnerCustomer.ptnr_id,
				ptnrPtnrgId: partnerCustomer.ptnr_ptnrg_id,
				ptnrLimitCredit: partnerCustomer.ptnr_limit_credit,
				sqTotal: req.body.sq_total
			}
			await this.checkDebtCustomer(dataCheck)
	
			// startTransaction, count data SQ, and create sqCode
			transaction = await sequelize.transaction()
			let countDataSQ = await SqMstr.count()
			const sqCode = `SQ${authUser.detail_user.ptnr_en_id}0${moment().format('MMYY')}00${countDataSQ + 1}`
	
			// creaetHeaderSalesQuotation
			let dataHeader = {
				bodyHeader: req.body,
				authUser: authUser,
				sqCode: sqCode,
				partnerCustomer: partnerCustomer
			}
			let headerSalesQuotation = await this.createHeaderSalesQuotation(dataHeader)
	
			// inputProductToTable: public.sqd_det
			let dataBody = {
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
			}
	
			await this.inputProductToDetailSalesQuotation(dataBody)
	
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
	
		let partnerGroup = await PtnrgGrp.findOne({
			where: {
				ptnrg_id: dataCheck.ptnrPtnrgId
			}
		})
	
		let total = debt.debt_total + dataCheck.sqTotal
		var limit
	
		if (dataCheck.ptnrLimitCredit > 0) {
			if ( total >= dataCheck.ptnrLimitCredit) {
				limit = {
					status: 'gagal',
					error: 'total dari pembelian barang dan piutangmu melebihi limit'
				}
				return limit
				return
			}
		}
	
		if (partnerGroup.ptnrg_limit_credit  > 0) {
			if (total >= partnerGroup.ptnrg_limit_credit) {
				limit = {
					status: 'gagal',
					error: 'total dari pembelian barang dan piutangmu melebihi limit'
				}
	
				return limit
				return
			}
		}
	}

	createHeaderSalesQuotation = async (dataHeader) => {
		let headerSalesQuotation = await SqMstr.create({
			sq_oid: uuidv4(),
			sq_dom_id: dataHeader.authUser.detail_user.ptnr_dom_id,
			sq_en_id: dataHeader.authUser.detail_user.ptnr_en_id,
			sq_add_by: dataHeader.authUser.usernama,
			sq_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
			sq_code: dataHeader.sqCode,
			sq_ptnr_id_sold: parseInt(dataHeader.bodyHeader.sq_ptnr_id_sold),
			sq_ptnr_id_bill: parseInt(dataHeader.bodyHeader.sq_ptnr_id_sold),
			sq_date: moment().format('YYYY-MM-DD'),
			sq_si_id: 992,
			sq_type: 'R',
			sq_sales_person: dataHeader.authUser.user_ptnr_id,
			sq_pi_id: dataHeader.bodyHeader.sq_pi_id,
			sq_pay_type: 9942,
			sq_pay_method: parseInt(dataHeader.bodyHeader.sq_pay_method),
			sq_dp: 0,
			sq_disc_header: 0,
			sq_total: parseInt(dataHeader.bodyHeader.sq_total),
			sq_due_date: moment().format('YYYY-MM-DD'),
			sq_close_date: moment().add(3, 'days').format('YYYY-MM-DD'),
			sq_trans_id: 'D',
			sq_trans_rmks: (dataHeader.bodyHeader.sq_trans_rmks) ? dataHeader.bodyHeader.sq_trans_rmks : null,
			sq_dt: moment().format('YYYY-MM-DD HH:mm:ss'),
			sq_cu_id: 1,
			sq_total_ppn: 0,
			sq_total_pph: 0,
			sq_payment: 0,
			sq_exc_rate: parseInt(dataHeader.bodyHeader.sq_cu_id),  
			sq_tax_inc: null,
			sq_cons: dataHeader.bodyHeader.sq_cons,
			sq_terbilang: dataHeader.bodyHeader.sq_terbilang,
			sq_credit_term: dataHeader.bodyHeader.sq_credit_term,
			sq_interval: 0,
			sq_ar_ac_id: 13,
			sq_ar_sb_id: 0,
			sq_ar_cc_id: 0,
			sq_need_date: moment(dataHeader.bodyHeader.sq_need_date).format('YYYY-MM-DD'),
			sq_is_package: 'N',
			sq_sales_program: '-',
			sq_booking: dataHeader.bodyHeader.sq_booking,
			sq_book_start_date: (dataHeader.bodyHeader.due_date) ? dataHeader.bodyHeader.due_date : moment().format('YYYY-MM-DD HH:mm:ss'),
			sq_book_end_date: moment(dataHeader.bodyHeader.sq_close_date).format('YYYY-MM-DD'),
			sq_alocated: dataHeader.bodyHeader.sq_alocated,
			sq_ptsfr_loc_id: parseInt(dataHeader.bodyHeader.sq_loc_id),
			sq_ptsfr_loc_to_id: 10001,
			sq_ptsfr_loc_git: 10004,
			sq_en_to_id: dataHeader.partnerCustomer.ptnr_en_id,
			sq_dropshipper: dataHeader.bodyHeader.sq_is_dropshipper,
			sq_ship_to: (dataHeader.bodyHeader.sq_is_dropshipper == 'Y' ) ? dataHeader.bodyHeader.sq_ship_to : null
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
	
		return headerSalesQuotation
	}

	inputProductToDetailSalesQuotation = async (data) => {
		let convertToJson = JSON.parse(data.bodySQ)

		for (const bodySalesQuotation of convertToJson) {
			let countDetailProductSalesQuotation = await this.countDetailSalesQuotation(data.sqOid)
			let costProductSalesQuotation = await this.getInvctTable(bodySalesQuotation.sqd_pt_id)
			let sequenceDetailProductSalesQuotation = (countDetailProductSalesQuotation) ? countDetailProductSalesQuotation + 1 : 1
			let unitMeasureProduct = await this.getUnitMeasureProduct(bodySalesQuotation.sqd_pt_id)
	
			let dataUpdateQtyProduct = {
				sqdPtId: bodySalesQuotation.sqd_pt_id,
				sqdLocId: bodySalesQuotation.sqd_loc_id,
				sqdQtyBooking: bodySalesQuotation.sqd_qty_booking
			}
			if (data.isBooking == 'Y') {await this.updateStockProduct(dataUpdateQtyProduct)}
	
			await SqdDet.create({
				sqd_oid: uuidv4(),
				sqd_dom_id: data.sqDomId,
				sqd_en_id: data.sqEnId,
				sqd_add_by: data.userName,
				sqd_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
				sqd_sq_oid: data.sqOid,
				sqd_seq: parseInt(sequenceDetailProductSalesQuotation),
				sqd_is_additional_charge: 'N',
				sqd_si_id: 992,
				sqd_pt_id: bodySalesQuotation.sqd_pt_id,
				sqd_rmks: '',
				sqd_qty: bodySalesQuotation.sqd_qty,
				sqd_qty_booking: (data.isBooking) ? bodySalesQuotation.sqd_qty : 0,
				sqd_loc_id: bodySalesQuotation.sqd_loc_id,
				sqd_cost: costProductSalesQuotation.invct_cost,
				sqd_price: bodySalesQuotation.sqd_price,
				sqd_sales_ac_id: 13,
				sqd_sales_sb_id: 0,
				sqd_sales_cc_id: 0,
				sqd_um: unitMeasureProduct.pt_um,
				sqd_um_conv: 1,
				sqd_taxable: 'N',
				sqd_tax_inc: 'N',
				sqd_tax_class: 9949,
				sqd_dt: moment().format('YYYY-MM-DD HH:mm:ss'),
				sqd_payment: 0,
				sqd_dp: 0,
				sqd_sales_unit: 0,
			}, {
				logging: async (sql, queryObject) => {
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
							$26: value[25]
						}
					})
				}
			})
		}
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
}

module.exports = new SalesQuotationController()