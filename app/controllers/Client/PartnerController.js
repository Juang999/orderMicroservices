const {Op} = require('sequelize')
const {PtnrMstr, PtnraAddr, PtnrgGrp, CodeMstr, EnMstr, LocMstr, Sequelize} = require('../../../models')
const {v4: uuidv4} = require('uuid')
const helper = require('../../../helper/helper')
const moment = require('moment')
let date = moment().tz('Asia/Jakarta').format('YYYY-MM-DD') +' '+ moment().tz('Asia/Jakarta').format('HH:mm:ss.SSS')

class PartnerController {
	getPartner = (req, res) => {
		let whereClause = {
			ptnr_is_emp: 'N',
			ptnr_active: 'Y',
			ptnr_is_cust: 'Y',
		}

		if (req.query.name) whereClause.ptnr_name = {[Op.like]: `%${req.query.name}%`}
		if (req.query.is_vendor) whereClause.ptnr_is_vend = req.query.is_vendor

		let page = (req.query.page == null) ? 1 : req.query.page
		let offset = page * 10 - 10
		let limit = 20

		PtnrMstr.findAll({
			where: whereClause,
			offset: offset,
			limit: limit,
			attributes: ['ptnr_oid', 'ptnr_id', 'ptnr_name', 'ptnr_add_date', 'ptnr_ptnrg_id', 'ptnr_area_id'],
			order: [['ptnr_add_date', 'desc']],
			include: [
				{
					model: PtnrgGrp,
					as: 'ptnr_group',
					attributes: ['ptnrg_desc']
				}
			]
		}).then(result => {
			let final = {
				data: result,
				page: page,
				total_data: limit
			}
			res.status(200)
				.json({
					status: 'success',
					message: 'berhasil mengambil data',
					data: final
				})
		}).catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					message: 'gagal mengambil data',
					error: err.message
				})
		})
	}

	createNewPartner = async (req, res) => {
		try {
			let authUser = await helper.auth(req.get('authorization'))

			let partnerParent = (req.body.customerIsDistributor == 'Y') ? authUser.user_ptnr_id : req.params.partnerParent;
	
			// getLastIdFromTable ptnr_mstr
			let lastCustomer = await PtnrMstr.findOne({
				where: {
					ptnr_is_cust: 'Y'
				},
				order: [['ptnr_id', 'desc']],
				attributes: ['ptnr_id']
			})
	
			let ptnr_id = lastCustomer.ptnr_id + 1
	
			let ptnr_code = ''
	
			ptnr_code = (req.body.partnerIsCustomer == 'Y') ? `${ptnr_code}CU` : `${ptnr_code}`
			ptnr_code = (req.body.partnerIsVendor == 'Y') ? `${ptnr_code}SP` : `${ptnr_code}`
			ptnr_code = (req.body.partnerIsMember == 'Y') ? `${ptnr_code}SL` : `${ptnr_code}`
			ptnr_code = (req.body.partnerIsEmployee == 'Y') ? `${ptnr_code}EM` : `${ptnr_code}`
			ptnr_code = (req.body.partnerIsWriter == 'Y') ? `${ptnr_code}WR` : `${ptnr_code}`
	
			let base_zero = '0000000'
			
			let string = ptnr_id.toString()
	
			let partner_code = ptnr_code + '00' + req.body.entityId + base_zero.substring(0, base_zero.length - string.substring(4).length) + string.substring(4)
	
			let createPartner = await PtnrMstr.create({
				ptnr_oid: uuidv4(),
				ptnr_dom_id: 1,
				ptnr_en_id: parseInt(req.body.entityId),
				ptnr_add_by: authUser.usernama,
				ptnr_add_date: date,
				ptnr_id: parseInt(ptnr_id),
				ptnr_code: partner_code,
				ptnr_name: (req.body.partnerName)? req.body.partnerName : null,
				ptnr_ptnrg_id: parseInt(req.body.partnerGroupId),
				ptnr_parent: partnerParent,
				ptnr_is_cust: (req.body.partnerIsCustomer)? req.body.partnerIsCustomer : 'N',
				ptnr_is_vend: (req.body.partnerIsVendor)? req.body.partnerIsVendor : 'N',
				ptnr_active: (req.body.partnerActive)? req.body.partnerActive : 'N',
				ptnr_dt: date,
				ptnr_ac_ar_id: 0,
				ptnr_sb_ar_id: 0,
				ptnr_cc_ar_id: 0,
				ptnr_ac_ap_id: 0,
				ptnr_sb_ap_id: 0,
				ptnr_cc_ap_id: 0,
				ptnr_cu_id: (req.body.partnerCurrencyId) ? parseInt(req.body.partnerCurrencyId) : null,
				ptnr_limit_credit: 0,
				ptnr_is_member: (req.body.partnerIsMember) ? req.body.partnerIsMember : 'N',
				ptnr_is_emp: (req.body.partnerIsEmployee) ? req.body.partnerIsEmployee : 'N',
				ptnr_is_writer: (req.body.partnerIsWriter) ? req.body.partnerIsWriter : 'N',
				ptnr_transaction_code_id: (req.body.partnerTransactionCodeId) ? parseInt(req.body.partnerTransactionCodeId) : null,
				ptnr_email: (req.body.partnerEmail) ? req.body.partnerEmail : null,
				ptnr_address_tax: '-',
				ptnr_contact_tax: '-',
				ptnr_name_alt: (req.body.partnerNameAlternative) ? req.body.partnerNameAlternative : null,
				ptnr_is_ps: (req.body.partnerIsPs) ? req.body.partnerIsPs : null,
				ptnr_start_periode: moment().tz('Asia/Jakarta').format('YYYYMMDD'),
				ptnr_is_bm: (req.body.partnerIsBm) ? req.body.partnerIsBm : 'N',
				ptnr_sex: (req.body.partnerSex) ? parseInt(req.body.partnerSex) : null,
				ptnr_goldarah: parseInt(req.body.partnerBloodGroup),
				ptnr_birthday: moment(req.body.partnerDateBirthday).format('YYYY-MM-DD'),
				ptnr_negara: parseInt(req.body.partnerNation),
				ptnr_bp_date: (req.body.partnerBpType) ? moment(req.body.partnerBpDate).format('YYYY-MM-DD') : null,
				ptnr_bp_type: (req.body.partnerBpType) ? parseInt(req.body.partnerBpType) : null,
				ptnr_is_volunteer: (req.body.partnerIsVolunteer) ? req.body.partnerIsVolunteer : null,
				ptnr_is_sbm: (req.body.partnerIsSbm) ? req.body.partnerIsSbm : 'N',
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
							$41: value[40]
						}
					})
				}
			})
			res.status(200)
			.json({
				status: 'success',
				message: 'berhasil membuat customer baru',
				data: createPartner
			})
		} catch (error) {
			res.status(400)
			.json({
				status: 'failed',
				message: 'gagal membuat customer baru',
				error: error.message
			})
		}
	}

	getDetailCustomer = async (req, res) => {
		let authUser = await helper.auth(req.get('authorization'))

		PtnrMstr.findOne({
			where: {
				ptnr_oid: req.params.ptnr_oid,
				ptnr_id: {
					[Op.not]: authUser.user_ptnr_id
				}
			},
			include: [
				{
					model: CodeMstr,
					as: 'ptnr_gender',
					attributes: ['code_field', 'code_code', 'code_name', 'code_desc']
				},
				{
					model: CodeMstr,
					as: 'ptnr_transaction',
					attributes: ['code_field', 'code_code', 'code_name', 'code_desc']
				},
				{
					model: CodeMstr,
					as: 'ptnr_blood_group',
					attributes: ['code_field', 'code_code', 'code_name', 'code_desc']
				},
				{
					model: CodeMstr,
					as: 'ptnr_nation',
					attributes: ['code_field', 'code_code', 'code_name', 'code_desc']
				},
				{
					model: CodeMstr,
					as: 'ptnr_sales_type',
					attributes: ['code_field', 'code_code', 'code_name', 'code_desc']
				},
				{
					model: EnMstr,
					as: 'ptnr_entity',
					attributes: ['en_id', 'en_desc']
				},
				{
					model: PtnrgGrp,
					as: 'ptnr_group',
					attributes: ['ptnrg_desc']
				},
				{
					model: PtnraAddr,
					as: 'address_partner',
					attributes: ['ptnra_oid', 'ptnra_line', 'ptnra_line_1', 'ptnra_line_2', 'ptnra_line_3', 'ptnra_phone_1', 'ptnra_fax_1', 'ptnra_zip']
				},
			]
		}).then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'berhasil mengambil data customer',
					data: result
				})
		}).catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					message: 'gagal mengambil data',
					error: err.message
				})
		})
	}

	getSalesPartner = async (req, res) => {
		try {
			let user = await helper.auth(req.get('authorization'))
	
			let partner = await PtnrMstr.findAll({
				attributes: ['ptnr_id', 'ptnr_name'],
				where: {
					ptnr_parent: user.user_ptnr_id
				}
			})

			res.status(200)
				.json({
					status: 'berhasil!',
					data: partner,
					error: null
				})
		} catch (error) {
			res.status(400)
				.json({
					status: 'gagal!',
					data: null,
					error: error.message
				})
		}
	}

	getParentSales = (req, res) => {
		PtnrMstr.findAll({
			attributes: [
				'ptnr_id',
				'ptnr_name',
				[
					Sequelize.literal('ptnr_group.ptnrg_desc'), 'group'
				]
			],
			include: [
				{
					model: PtnrgGrp,
					as: 'ptnr_group',
					attributes: []
				}
			],
			where: {
				ptnr_ptnrg_id: {
					[Op.in]: (req.query.groupid) ? [parseInt(req.query.groupid)] : [998, 9911]
				},
				ptnr_name: {
					[Op.iLike]: (req.query.search) ? `%${req.query.search}%` : '%%'
				},
				ptnr_is_cust: 'Y',
				ptnr_active: 'Y'
			}
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
					status: 'failed!',
					data: null,
					error: err.message
				})
		})
	}

	getPartnerWithWarehouse = (req, res) => {
		PtnrMstr.findAll({
			distinct: true,
			attributes: [
				['ptnr_id', 'partner_id'],
				['ptnr_name', 'partner_name'],
				[Sequelize.col('warehouse.loc_id'), 'warehouse_id'],
				[Sequelize.col('warehouse.loc_desc'), 'warehouse_name']
			],
			include: [
				{
					model: LocMstr,
					as: 'warehouse',
					attributes: []
				}
			],
			where: {
				[Op.and]: [
					Sequelize.where(Sequelize.col('warehouse.loc_ptnr_id'), {
						[Op.not]: null
					}),
					Sequelize.where(Sequelize.col('ptnr_is_emp'), {
						[Op.eq]: 'N'
					})
				]
			}
		})
		.then(result => {
			res.status(200)
				.json({
					code: 200,
					status: 'berhasil!',
					data: result,
					error: null
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					code: 400,
					status: 'gagal!',
					data: null,
					error: err.message
				})
		})
	}
}

module.exports = new PartnerController()