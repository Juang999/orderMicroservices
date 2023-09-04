const {PtnraAddr, PtnracCntc, EnMstr} = require('../../../models')
// const {Sequelize, Op} = require('sequelize')
const {v4: uuidv4} = require('uuid')
const helper = require('../../../helper/helper')
const moment = require('moment')
let date = moment().tz('Asia/Jakarta').format('YYYY-MM-DD') +' '+ moment().tz('Asia/Jakarta').format('HH:mm:ss.SSS')

class PartnerAddressController {
	create = async (req, res) => {
		// getLastIdFromTable ptnra_addr
		let authUser = await helper.auth(req.get('authorization'))

		let lastAddressCustomer = await PtnraAddr.findOne({
			where: {
				ptnra_active: 'Y'
			},
			order: [['ptnra_id', 'desc']],
			attributes: ['ptnra_id']
		})

		let ptnra_id = lastAddressCustomer.ptnra_id + 1
        
		PtnraAddr.create({
			ptnra_oid: uuidv4(),
			ptnra_id: parseInt(ptnra_id),
			ptnra_dom_id: parseInt(req.body.partnerDomainId),
			ptnra_en_id: req.body.partnerEntityId,
			ptnra_add_by: authUser.usernama,
			ptnra_add_date: moment().tz('Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ss'),
			ptnra_line_1: req.body.partnerLine1,
			ptnra_line_2: req.body.partnerLine2,
			ptnra_line_3: req.body.partnerLine3,
			ptnra_phone_1: req.body.partnerPhone1,
			ptnra_phone_2: req.body.partnerPhone2,
			ptnra_fax_1: req.body.partnerFax1,
			ptnra_fax_2: req.body.partnerFax2,
			ptnra_zip: req.body.partnerZip,
			ptnra_ptnr_oid: req.body.partnerOid,
			ptnra_addr_type: parseInt(req.body.partnerAddressType),
			ptnra_comment: req.body.partnerComment,
			ptnra_active: (req.body.ptnra_active) ? req.body.ptnra_active : 'Y',
			ptnra_dt: date
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
					}
				})
			}
		}).then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'berhasil membuat data',
					data: result
				})
		}).catch(err => {
			console.log(err)
			res.status(400)
				.json({
					status: 'failed',
					message: 'gagal membuat data',
					error: err.message
				})
		})
	}

	show = (req, res) => {
		PtnraAddr.findAll({
			where: {
				ptnra_oid: req.params.ptnra_oid
			},
			include: [
				{
					model: EnMstr,
					as: 'ptnra_entity',
					attributes: ['en_desc']
                    
				},
				{
					model: PtnracCntc,
					as: 'contact_person'
				}
			]
		}).then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'berhasil mengambil data',
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
}

module.exports = new PartnerAddressController()