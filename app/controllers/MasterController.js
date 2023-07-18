const {PtnrgGrp, PtnrMstr, PsPeriodeMstr, CodeMstr, CuMstr, EnMstr, LocMstr} = require('../../models')
const {Op, Sequelize} = require('sequelize')
const helper = require('../../helper/helper')
const moment = require('moment')

const MasterController = {
	getGroup: (req, res) => {
		PtnrgGrp.findAll({
			attributes: ['ptnrg_id', 'ptnrg_name']
		}).then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'success to get data group',
					data: result
				})
		}).catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to get data group',
					error: err.message
				})
		})
	},
	getCustomer: (req, res) => {
		let where = {
			ptnr_is_cust: 'Y'
		}

		if (req.query.query) where.ptnr_name = {[Op.like]: `%${req.query.query}%`}

		PtnrMstr.findAll({
			where: where,
			limit: 20,
			offset: 0,
			attributes: ['ptnr_id', 'ptnr_name']
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
	},
	getPeriode: async (req, res) => {
		PsPeriodeMstr.findAll({
			attributes: [
				'periode_code', 
				[Sequelize.literal('concat(replace(to_char(periode_start_date, \'Month\'), \' \', \'\'), \' \', year(periode_start_date))'), 'periode_periode']
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
	},
	getPeriodeSales: async (req, res) => {
		let auth = await helper.auth(req.get('authorization'))
        
		PsPeriodeMstr.findAll({
			attributes: [
				'periode_code', 
				[Sequelize.literal('concat(replace(to_char(periode_start_date, \'Month\'), \' \', \'\'), \' \', year(periode_start_date))'), 'periode_periode']
			],
			where: {
				periode_code: {
					[Op.in]: Sequelize.literal(`(SELECT plans_periode FROM public.plans_mstr WHERE plans_sales_id = ${auth.user_ptnr_id})`)
				}
			},
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
	},
	getTaxInvoice: (req, res) => {
		CodeMstr.findAll({
			where: {
				code_field: 'fakturpajak_transactioncode'
			},
			attributes: ['code_id', 'code_name'],
			order: [['code_name', 'ASC']]
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
					message: 'gagal mengmabil data',
					error: err.message
				})
		})
	},
	getAddrType: (req, res) => {
		CodeMstr.findAll({
			where: {
				code_field: 'addr_type_mstr'
			},
			attributes: ['code_id', 'code_name']
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
					message: 'gagal menmgambil data',
					error: err.message
				})
		})
	},
	getContactPerson: (req, res) => {
		CodeMstr.findAll({
			where: {
				code_field: 'ptnrac_function'
			},
			attributes: ['code_id', 'code_name']
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
					error: err
				})
		})
	},
	getBpType: (req, res) => {
		CodeMstr.findAll({
			where: {
				code_field: 'bp_type'
			},
			attributes: ['code_id', 'code_name']
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
	},
	getCitizen: (req, res) => {
		CodeMstr.findAll({
			where: {
				code_field: 'WNegara'
			},
			attributes: ['code_id', 'code_name']
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
	},
	getBloodGroup: (req, res) => {
		CodeMstr.findAll({
			where: {
				code_field: 'gol_darah'
			},
			attributes: ['code_id', 'code_name']
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
					message: 'gagal menngambil data',
					error: err.message
				})
		})
	},
	getGender: (req, res) => {
		CodeMstr.findAll({
			where: {
				code_field: 'Jenis_Kelamin'
			},
			attributes: ['code_id', 'code_name']
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
	},
	getCurrency: (req, res) => {
		CuMstr.findAll({
			attributes: ['cu_id', 'cu_name']
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
	},
	getEntity: (req, res) => {
		EnMstr.findAll({
			attributes: ['en_id', 'en_code', 'en_desc']
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
	},
	getTimeStamp: (req, res) => {
		let timestamp = {
			day: moment().format('dddd'),
            
			month: moment().format('MMMM'),
			year: moment().format('YYYY'),
			time: moment().format('HH:mm:ss'),
			timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
		}

		res.status(200)
			.json({
				status: 'berhasil',
				message: 'berhasil mengambil data timestamp',
				data: timestamp
			})
	},
	getDefaultPeriode: (req, res) => {
		PsPeriodeMstr.findOne({
			where: {
				periode_start_date: {
					[Op.eq]: moment().startOf('month').format('YYYY-MM-DD')
				}
			},
			attributes: [
				'periode_code', 
				[Sequelize.literal('concat(replace(to_char(periode_start_date, \'DD\'), \' \', \'\'), \' \', replace(to_char(periode_start_date, \'month\'), \' \', \'\'), \' \', replace(to_char(periode_start_date, \'YYYY\'), \' \', \'\'))'), 'start_periode'],
				[Sequelize.literal('concat(replace(to_char(periode_end_date, \'DD\'), \' \', \'\'), \' \', replace(to_char(periode_end_date, \'month\'), \' \', \'\'), \' \', replace(to_char(periode_end_date, \'YYYY\'), \' \', \'\'))'), 'end_periode']
			]
		}).then(result => {
			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil mengambil data periode default',
					data: result
				})
		}).catch(err => {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal mengambil data periode default',
					error: err.message
				})
		})
	},
	getLocation: (req, res) => {
		LocMstr.findAll({
			where: {
				loc_id: {
					[Op.in]: [10001, 200010, 300018]
				}
			},
			attributes: ['loc_id', 'loc_desc'],
			order: [['loc_id', 'asc']]
		}).then(result => {
			res.status(200)
				.json({
					status: 'berhasil',
					messaeg: 'berhasil mengambil data lokasi',
					data: result
				})
		}).catch(err => {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal mengambil data lokasi',
					error: err.message
				})
		})
	},
	getPaymentType: (req, res) => {
		CodeMstr.findAll({
			where: {
				code_field: 'payment_type'
			},
			attributes: ['code_oid', 'code_id', 'code_name']
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
	getPaymentMethod: (req, res) => {
		CodeMstr.findAll({
			where: {
				code_field: 'payment_methode'
			},
			attributes: ['code_oid', 'code_id', 'code_name']
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
	getCreditTermsMstr: (req, res) => {
		CodeMstr.findAll({
			where: {
				code_field: 'creditterms_mstr'
			},
			attributes: ['code_oid', 'code_id', 'code_name']
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
	}
}

module.exports = MasterController