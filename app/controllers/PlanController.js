const {PlansMstr, PlansdDet, PtnrMstr, PsPeriodeMstr} = require('.././../models')
const helper = require('../../helper/helper')
const {Sequelize, Op} = require('sequelize')
const moment = require('moment')
const {v4: uuidv4} = require('uuid')

const PlanController = {
	getPlan: async (req, res) => {
		let authUser = await helper.auth(req.get('authorization'))

		PlansMstr.findAll({
			where: {
				plans_sales_id: authUser.user_ptnr_id,
				plans_periode: {
					[Op.in]: Sequelize.literal(`(SELECT periode_code FROM public.psperiode_mstr WHERE periode_id >= (SELECT periode_id FROM public.psperiode_mstr WHERE periode_code = '${moment().format('YYYYMM')}'))`)
				}
			},
			include: [
				{
					model: PsPeriodeMstr,
					as: 'periode',
					attributes: [[Sequelize.literal('replace(to_char(periode_start_date, \'Month\'), \' \', \'\')'), 'month']]
				}
			],
			attributes: ['plans_oid']


		}).then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'berhasil mengambil data planning',
					data: result
				})
		}).catch(err => {
			console.log(err)
			res.status(400)
				.json({
					status: 'failed',
					message: 'gagal mengambil data',
					error: err.message
				})
		})
	},
	createUnplan: async (req, res) => {
		try {
			let user = await helper.auth(req.get('authorization'))
			console.log(req.body)

			let getPlanMaster = await PlansMstr.findOne({
				where: {
					plans_sales_id: user.user_ptnr_id,
					plans_periode: req.body.periode_code
				},
				attributes: ['plans_oid']
			})

			let rawSeq = await PlansdDet.findOne({
				where: {
					plansd_plans_oid: getPlanMaster.plans_oid
				},
				order: [['plansd_seq', 'DESC']],
				attributes: ['plansd_seq']
			})

			let seq = (rawSeq) ? rawSeq.plansd_seq + 1 : 1

			let data = await PlansdDet.create({
				plansd_oid: uuidv4(),
				plansd_plans_oid: getPlanMaster.plans_oid,
				plansd_ptnr_id: req.body.ptnr_id,
				plansd_amount: req.body.amount,
				plansd_seq: seq
			})

			res.status(200)
				.json({
					status: 'success',
					message: 'berhasil membuat data',
					data: data
				})
		} catch (error) {
			console.log(error)
			res.status(400)
				.json({
					status: 'failed',
					message: 'gagal membuat data',
					error: error.message
				})
		}
	},
	getCustomerPerPeriode: async (req, res) => {
		try {
			let user = await helper.auth(req.get('authorization'))

			let periode = (req.query.periode) ? req.query.periode : moment().format('YYYYMM')

			let string = `(
                        SELECT plans_oid FROM public.plans_mstr
                        WHERE plans_sales_id = ${user.user_ptnr_id}
                        and plans_periode = '${periode}'
                        )`

			let plansdDet = await PlansdDet.findAll({
				where: {
					plansd_plans_oid: {
						[Op.eq]: Sequelize.literal(string)
					}
				},
				include: [
					{
						model: PtnrMstr,
						as: 'PlansCustomer',
						attributes: ['ptnr_oid', 'ptnr_name']
					}
				],
				attributes: ['plansd_oid', 'plansd_ptnr_id', 'plansd_amount']
			})

			res.status(200)
				.json({
					status: 'success',
					message: 'berhasil mengambil data',
					data: plansdDet
				})
		} catch (error) {
			console.log(error)
			res.status(400)
				.json({
					status: 'failed',
					message: 'gagal mengambil data',
					error: error.message
				})
		}
	}
}

module.exports = PlanController