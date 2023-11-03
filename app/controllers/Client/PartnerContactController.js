const {PtnracCntc} = require('../../../models')
const {v4: uuidv4} = require('uuid')
const helper = require('../../../helper/helper')
const moment = require('moment')
let date = moment().tz('Asia/Jakarta').format('YYYY-MM-DD') +' '+ moment().tz('Asia/Jakarta').format('HH:mm:ss.SSS')

class PartnerContactController {
	create = async (req, res) => {
		try {
			let authUser = await helper.auth(req.get('authorization'))

			let lastContactPersonCustomer = await PtnracCntc.findOne({
				where: {
					addrc_ptnra_oid: req.body.partnerAccountAddressOid
				},
				attributes: ['ptnrac_seq']
			})

			let seq = (lastContactPersonCustomer != null) ? lastContactPersonCustomer.ptnrac_seq + 1 : 1

			let contactPerson = await PtnracCntc.create({
				ptnrac_oid: uuidv4(),
				addrc_ptnra_oid: req.body.partnerAccountAddressOid,
				ptnrac_add_by: authUser.usernama,
				ptnrac_add_date: moment().tz('Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ss'),
				ptnrac_seq: seq,
				ptnrac_function: parseInt(req.body.partnerAccountFunction), 
				ptnrac_contact_name: req.body.partnerContactName,
				ptnrac_phone_1: req.body.partnerPhone1,
				ptnrac_phone_2: req.body.partnerContact2,
				ptnrac_email: req.body.partnerContactEmail,
				ptnrac_dt: date
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
						}
					})
				}
			})

			res.status(200)
				.json({
					status: 'success',
					message: 'berhasil membuat data kontak personal',
					data: contactPerson
				})
		} catch (error) {
			res.status(400)
				.json({
					status: 'failed',
					message: 'gagal membuat kontak personal',
					error: error.message
				})
		}
	}

	show = (req, res) => {
		PtnracCntc.findOne({
			where: {
				ptnrac_oid: req.params.ptnrac_oid
			}
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

module.exports = new PartnerContactController()