require('dotenv').config()
const {TConfUser, TConfGroup, PlansMstr, VisitMstr} = require('../../models')
const cryptr = require('cryptr')
const crypter = new cryptr('thisIsSecretPassword')
const jwt = require('jsonwebtoken')
const helper = require('../../helper/helper')
const {Sequelize, Op} = require('sequelize')
const moment = require('moment/moment')

const AuthController = {
	login: (req, res) => {
		TConfUser.findOne({
			where: {
				usernama: req.body.username,
				password: req.body.password,
				user_ptnr_id: {
					[Op.not]: null,
					[Op.in]: Sequelize.literal('(SELECT ptnr_id FROM public.ptnr_mstr WHERE ptnr_is_emp = \'Y\')')
				}
			},
			attributes: ['userid', 'usernama', 'password']
		}).then(async result => {
			if (result == null) {
				res.status(400)
					.json({
						status: 'ditolak',
						message: 'gagal login'
					})
                
				return
			}

			let data = {
				userid: result.userid,
				name: result.usernama,
				security_word: await crypter.encrypt(result.password),
			}

			let token = await jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '24h'})

			res.status(200)
				.json({
					status: 'berhasil',
					data: token
				})
		}).catch(err => {
			res.status(400)
				.json({
					status: 'gagal',
					message: err.message
				})
		})
	},
	authenticate: async (req, res) => {
		try {
			if (!req.body) {
				res.status(300)
					.json({
						result: 'forbidden',
						message: 'forbidden',
						errorType: 1
					})
                
				return
			}

			let token = req.body.token && req.body.token.split(' ')[1]

			jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
				if(err) {
					res.sendStatus(400)
					return
				}

				let authUser = await TConfUser.findOne({
					where: {
						usernama: user.name
					},
					attributes: ['usernama', 'password']
				})
    
				if (!authUser) {
					res.status(403)
						.json({
							message: 'unauthorize'
						})
    
					return
				}
    
				let verifyPassword = await crypter.decrypt(user.security_word)
				if (verifyPassword != authUser.password) {
					res.status(403)
						.json({
							result: false
						})
                
					return
				}

			})

			res.status(200)
				.json({
					result: true
				})
		} catch (error) {
			res.status(403)
				.json({
					result: false,
					message: 'error, please report to customer service'
				})
		}
	},
	profile: async (req, res) => {
		try {
			let user = await helper.auth(req.get('authorization'))

			let dataGroup = await TConfGroup.findOne({
				where: {
					groupid: user.groupid
				},
				attributes: ['groupnama']
			})

			let countPlanning = await PlansMstr.count({
				where: {
					[Op.and]: {
						plans_sales_id: {
							[Op.eq]: user.user_ptnr_id
						},
						plans_periode: {
							[Op.in]: Sequelize.literal(`(SELECT periode_code FROM public.psperiode_mstr WHERE YEAR(periode_start_date) = '${moment().format('YYYY')}')`)
						}
					}
				}
			})

			let countScheduleVisiting = await VisitMstr.count({
				where: {
					[Op.and]: {
						visit_sales_id: {
							[Op.eq]: user.user_ptnr_id
						},
						visit_startdate: {
							[Op.between]: [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')]
						}
					}
				}
			})

			let countHasVisited = await VisitMstr.count({
				where: {
					[Op.and]: {
						visit_sales_id: {
							[Op.eq]: user.user_ptnr_id
						},
						visit_startdate: {
							[Op.between]: [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')]
						},
						visit_status: {
							[Op.eq]: 'Y'
						}
					}
				}
			})

			let data = {
				usernama: user.usernama,
				group: dataGroup.groupnama,
				userphone: user.userphone,
				countPlanning: countPlanning,
				visit: {
					visited: countHasVisited,
					totalVisit: countScheduleVisiting
				}
			}
    
			res.status(200)
				.json({
					status: 'success',
					message: 'berhasil mengambil data profile',
					data: data
				})
		} catch (error) {
			console.log(error)
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal mengambil data profile',
					error: error.message
				})
		}
	},
	loginAdmin: async (req, res) => {
		try {
			let admin = await TConfUser.findOne({
				attributes: ['userid', 'usernama', 'password', 'user_ptnr_id'],
				where: {
					[Op.and]: [
						Sequelize.where(Sequelize.col('usernama'), {
							[Op.eq]: req.body.username
						}),
						Sequelize.where(Sequelize.col('password'), {
							[Op.eq]: req.body.password
						}),
						Sequelize.where(Sequelize.col('user_ptnr_id'), {
							[Op.in]: Sequelize.literal(`(SELECT ptnr_id FROM public.ptnr_mstr WHERE ptnr_is_emp = 'Y')`)
						}),
						Sequelize.where(Sequelize.col('groupid'), {
							[Op.in]: Sequelize.literal(`(SELECT groupid FROM public.tconfgroup WHERE groupnama = 'ADMIN')`)
						})
					]
				}
			})

			if (admin == null) {
				res.status(403)
					.json({
						status: 'failed',
						token: null,
						error: 'error to login'
					})

				return
			}

			let data = {
				userid: admin.userid,
				name: admin.usernama,
				ptnrid: admin.user_ptnr_id,
				security_word: await crypter.encrypt(admin.password),
			}

			let token = await jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '24h'})

			res.status(200)
				.json({
					status: 'success!',
					token: token,
					error: null
				})

		} catch (error) {
			res.status(400)
				.json({
					status: error.message,
					token: null,
					error: error.stack
				})
		}
	}
}

module.exports = AuthController