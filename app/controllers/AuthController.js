require('dotenv').config({path: 'root/microservice_dev/orderMicroservice/.env'})
const {TConfUser, TConfGroup, PlansMstr, VisitMstr, EnMstr, PtnrMstr, PtnraAddr, ArMstr} = require('../../models')
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
                    status: "berhasil",
                    data: token
                })
        }).catch(err => {
            console.log(err)
            res.status(400)
                .json({
                    status: "gagal",
                    message: err.message
                })
        })
    },
    authenticate: async (req, res) => {
        try {
            if (!req.body) {
                res.status(300)
                    .json({
                        result: "forbidden",
                        message: "forbidden",
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
			let auth = await helper.auth(req.get('authorization'))

			let user = await TConfUser.findOne({
				attributes: [
					'userid',
					'usernama',
					'password',
					'nik_id',
					[Sequelize.col('detail_user.ptnr_code'), 'ptnr_code'],
					[Sequelize.col('entity.en_desc'), 'en_desc'],
					[
						Sequelize.fn('CONCAT', 
							Sequelize.col('detail_user->address_partner.ptnra_line_1'), 
							' ', 
							Sequelize.col('detail_user->address_partner.ptnra_line_2'), 
							' ', 
							Sequelize.col('detail_user->address_partner.ptnra_line_3')), 
						'ptnra_address'
					],
					[Sequelize.col('detail_user->address_partner.ptnra_phone_1'), 'phone_1'],
					[Sequelize.col('detail_user->address_partner.ptnra_phone_2'), 'phone_2'],
					[Sequelize.literal(`(SELECT CASE WHEN count(ar_amount) > 0 THEN SUM (ar_amount - ar_pay_amount) ELSE 0 END AS ar_total FROM public.ar_mstr WHERE ar_bill_to = ${auth.user_ptnr_id})`), 'ar_amount']
				],
				include: [
					{
						model: EnMstr,
						as: 'entity',
						attributes: []
					}, {
						model: PtnrMstr,
						as: 'detail_user',
						attributes: [],
						include: [
							{
								model: PtnraAddr,
								as: 'address_partner',
								required: false,
								attributes: []
							}
						]
					}
				],
				where: {
					userid: auth.userid
				}
			})

			res.status(200)
				.json({
					status: 'success',
					message: 'berhasil mengambil data profile',
					data: user
				})
		} catch (error) {
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
	},
	AuthenticateAdmin: async (req, res) => {
		try {
			let authHeader = req.body.token
    		let token = authHeader && authHeader.split(" ")[1]

			if (!token) {
				res.status(400)
					.json({
						status: 'failed',
						message: "unauthorize",
						error: "unauthorize"
					})

				return
			}

			jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
				if (err) {
					if (err.message == 'jwt expired') {
						res.status(400)
							.json({
								code: 400,
								status: err.message,
								error: err.message
							})
						
						return
					} else {
						res.status(400)
							.json({
								code: 400,
								status: "failed",
								message: "failed login"
							})
			
							return
					}
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
							code: 403,
							message: "unauthorize"
						})
		
					return
				}
		
				let verifyPassword = await crypter.decrypt(user.security_word)
				if (verifyPassword != authUser.password) {
					res.status(403)
						.json({
							code: 403,
							result: false
						})
				
						return
				}
		
				res.status(200)
					.json({
						code: 200,
						status: 'approved!',
						data: null,
						error: null
					})
			})
		} catch (error) {
			res.status(400)
				.json({
					code: 400,
					status: 'rejected!',
					data: null,
					error: error.stack
				})
		}
	},
	getProfileAdmin: (req, res) => {
		helper.auth(req.get('authorization'))
			.then(result => {
				res.status(200)
					.json({
						code: 200,
						status: 'success!',
						data: result,
						error: null
					})
			})
			.catch(err => {
				res.status(400)
					.json({
						code: 400,
						status: err.message,
						data: null,
						error: err.stack
					})
			})
	}
}

module.exports = AuthController