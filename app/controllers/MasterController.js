const {PtnrgGrp, PtnrMstr, PsPeriodeMstr, CodeMstr, CuMstr, EnMstr, LocMstr} = require('../../models')
const {Op, Sequelize} = require('sequelize')
const {page} = require('../../helper/helper')
const moment = require('moment')

class MasterController {
	getGroup = (req, res) => {
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
	}

	getDefaultPeriode = async (req, res) => {
		PsPeriodeMstr.findAll({
			attributes: [
				'periode_code', 
				[Sequelize.literal('concat(replace(to_char(periode_start_date, \'Month\'), \' \', \'\'), \' \', year(periode_start_date))'), 'periode_periode']
			],
			where: {
				periode_start_date: moment().startOf('months').format('YYYY-MM-DD')
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

	getPeriode = async (req, res) => {
		PsPeriodeMstr.findAll({
			attributes: [
				'periode_code', 
				[Sequelize.literal('concat(replace(to_char(periode_start_date, \'Month\'), \' \', \'\'), \' \', year(periode_start_date))'), 'periode_periode'],
				[Sequelize.fn('TO_CHAR', Sequelize.col('periode_start_date'), 'YYYY-MM-DD'), 'start_date'],
				[Sequelize.fn('TO_CHAR', Sequelize.col('periode_end_date'), 'YYYY-MM-DD'), 'end_date']
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

	getTaxInvoice = (req, res) => {
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
	}

	getAddrType = (req, res) => {
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
	}

	getContactPerson = (req, res) => {
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
					error: err.message
				})
		})
	}

	getBpType = (req, res) => {
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
	}

	getCitizen = (req, res) => {
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
	}

	getBloodGroup = (req, res) => {
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
	}

	getGender = (req, res) => {
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
	}

	getCurrency = (req, res) => {
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
	}

	getEntity = (req, res) => {
		EnMstr.findAll({
			attributes: [
					'en_id', 
					'en_code', 
					'en_desc',
					[Sequelize.literal("CASE WHEN en_id = 2 THEN 200010 WHEN en_id = 3 THEN 300018 ELSE 10001 END"), 'en_loc_id']
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

	getLocation = (req, res) => {
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
	}

	getPaymentType = (req, res) => {
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
	}

	getPaymentMethod = (req, res) => {
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
	}

	getCreditTermsMstr = (req, res) => {
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
	}

	getSalesProgram = (req, res) => {
		CodeMstr.findAll({
			attributes: ['code_id','code_field','code_name'],
			where: {
				code_field: 'sales_program'
			},
			order: [['code_id', 'asc']]
		})
		.then(result => {
			res.status(200)
				.json({
					code: 200,
					status: 'success',
					data: result,
					error: null
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					code: 400,
					status: 'failed',
					data: null,
					error: err.message
				})
		})
	}
}

module.exports = new MasterController()