const {VisitMstr, VisitedDet, PsPeriodeMstr, PtnrMstr, CodeMstr, sequelize} = require('../../../models')
const {Sequelize, Op} = require('sequelize')
const helper = require('../../../helper/helper')
const moment = require('moment')
const {v4: uuidv4} = require('uuid')
const express = require('express')
const upload = require('express-fileupload')
const path = require('path')
const {Buffer} = require('buffer')
const fs = require('fs')

const app = express()

app.use(upload())

class VisitController {
	getVisitingSchedule = async (req, res) => {
		try {
			let authUser = await helper.auth(req.get('authorization'))

			let where = {
				visit_sales_id: authUser.userid
			}

			where.visit_status = (req.query.status == 'Y') ? 'Y' : 'N'

			if (req.query.periode) {
				let periode = await PsPeriodeMstr.findOne({
					where: {
						periode_code: req.query.periode
					}
				})

				where.visit_startdate = {[Op.between]: [periode.periode_start_date, periode.periode_end_date]}
			} else {
				let startDate = moment().startOf('month').format('YYYY-MM-DD')
				let endDate = moment().endOf('momth').format('YYYY-MM-DD')

				where.visit_startdate = {[Op.between]: [startDate, endDate]}
			}


			let visitDate = await VisitMstr.findAll({
				attributes: [
					'visit_code', 
					'visit_startdate',
					'visit_enddate',
					'visit_status',
					[Sequelize.fn('COUNT', Sequelize.col('visit_detail.visited_visit_code')), 'total_customer']
				],
				include: [
					{
						model: VisitedDet,
						as: 'visit_detail',
						required: false,
						attributes: []
					}
				],
				where: where,
				order: [['visit_startdate', 'desc']],
				group: ['visit_code', 'visit_startdate', 'visit_enddate', 'visit_status']
			})

			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil mengambil data tanggal kunjungan',
					data: visitDate
				})
		} catch (error) {
			res.status(400)
				.json({
					status: 'failed',
					message: 'gagal mengambil data tanggal kunjungan',
					error: error.message
				})
		}
	}

	getDetailVisitSchedule = (req, res) => {
		VisitMstr.findOne({
			attributes: [
				'visit_code', 
				[Sequelize.literal('concat(replace(to_char(visit_startdate, \'Day\'), \' \', \'\'), \', \', to_char(visit_startdate, \'YYYY\'), \' \', replace(to_char(visit_startdate, \'Month\'), \' \', \'\'), \' \', to_char(visit_startdate, \'DD\'))'), 'visit_startdate'], 
				[Sequelize.literal('concat(replace(to_char(visit_enddate, \'Day\'), \' \', \'\'), \', \', to_char(visit_enddate, \'YYYY\'), \' \', replace(to_char(visit_enddate, \'Month\'), \' \', \'\'), \' \', to_char(visit_enddate, \'DD\'))'), 'visit_enddate'], 
				'visit_status',
				[Sequelize.literal(`(SELECT COUNT(*) FROM public.visited_det WHERE visited_det.visited_visit_code = '${req.params.visit_code}')`), 'total_customer']
			],
			where: {
				visit_code: req.params.visit_code
			},
			include: [
				{
					model: VisitedDet,
					as: 'visit_detail',
					required: false,
					attributes: [
						'visited_oid', 
						'visited_cus_name', 
						'visited_cus_phone', 
						'visited_cus_address', 
						'visited_type',
						[Sequelize.fn('TO_CHAR', Sequelize.col('visited_check_in'), 'YYYY-MM-DD, HH:mm:ss'), 'check_in'],
						[Sequelize.fn('TO_CHAR', Sequelize.col('visited_check_out'), 'YYYY-MM-DD, HH:mm:ss'), 'check_out'],
						'visited_lat_gps_check_in',
						'visited_long_gps_check_in',
						'visited_lat_gps_check_out',
						'visited_long_gps_check_out',
						'visited_ptnr_id'
					],
					where: {
						visited_visit_code: req.params.visit_code
					},
					include: [
						{
							model: CodeMstr,
							as: 'objective',
							attributes: [
								['code_name', 'name']
							]
						},
						{
							model: CodeMstr,
							as: 'output',
							attributes: [
								['code_name', 'name']
							]
						},
						{
							model: PtnrMstr,
							as: 'visited_partner',
							attributes: ['ptnr_id', 'ptnr_ptnrg_id', 'ptnr_name', 'ptnr_area_id']
						}
					],
					order: [['visit_check_in', 'DESC']]
				}
			]
		}).then(result => {
			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil mengambil detail data tanggal kunjungan',
					data: result
				})
		}).catch(err => {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal mengambil detail data tanggal kunjungan',
					error: err.message
				})
		})
	}

	getDetailVisiting = (req, res) => {
		VisitedDet.findOne({
			where: {
				visited_oid: req.params.visited_oid
			}
		}).then(result => {
			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil megambil detail kunjungan',
					data: result
				})
		}).catch(err => {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal mengambil detail kunjungan',
					error: err.message
				})
		})
	}

	createSchedule = async (req, res) => {
		let {userid, en_id, usernama} = await helper.auth(req.get('authorization'))
		let visitCode = await this.generateVisitCode(en_id)

		let transaction = await sequelize.transaction()
		try {
			let visit_mstr = await VisitMstr.create({
				visit_code: visitCode,
				visit_startdate: req.body.start_date,
				visit_enddate: req.body.end_date,
				visit_en_id: en_id,
				visit_sales_id: userid,
				visit_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
				visit_add_by: usernama,
				visit_status: 'N'
			})

			await transaction.commit()

			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil membuat jadwal kunjungan',
					data: visit_mstr
				})
		} catch (error) {
			await transaction.rollback()
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal membuat jadwal kunjungan',
					error: error.message
				})
		}
	}

	createListCustomerToVisit = async (req, res) => {
		let authUser = await helper.auth(req.get('authorization'))

		VisitedDet.create({
			visited_oid: uuidv4(),
			visited_visit_code: req.body.visit_code,
			visited_type: req.body.type,
			visited_ptnr_id: req.body.ptnr_id,
			visited_cus_name: req.body.cus_name,
			visited_cus_address: req.body.cus_address,
			visited_cus_phone: req.body.cus_phone,
			visited_add_by: authUser.usernama,
			visited_add_date: moment().format('YYYY-MM-DD HH:mm:ss')
		}).then(result => {
			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil membuat list kostumer',
					data: result
				})
		}).catch(err => {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal membuat list kostumer',
					error: err.message
				})
		})
	}

	checkIn = async (req, res) => {
		try {
			let authUser = helper.auth(req.get('authorization'))

			let checkLastData = await VisitedDet.findOne({
				where: {
					[Op.and]: {
						visited_check_in: {
							[Op.not]: null
						},
						visited_check_out: {
							[Op.is]: null
						},
						visited_visit_code: {
							[Op.eq]: req.body.visit_code
						}
					}
				}
			})

			const file = JSON.parse(req.body.file)
			const fileName = path.join(__dirname, `../../../public/images/checkin/${file.name}`)

			const buffer = Buffer.from(file.data.data, 'base64')

			if (checkLastData) {
				res.status(500)
					.json({
						status: 'gagal',
						message: `kamu belum checkout untuk checkout untuk kunjugan ${checkLastData.visited_cus_name}`,
						visited_oid: checkLastData.visited_oid
					})
                
				return
			}

			fs.writeFile(fileName, buffer, (err) => {
				if (err) {
					res.status(400)
						.json({error: err})
                
					return
				}
			})

			await VisitedDet.update({
				visited_lat_gps_check_in: req.body.checkin_lat,
				visited_long_gps_check_in: req.body.checkin_long,
				visited_address_gps_check_in: req.body.checkin_address,
				visited_check_in: moment().format('YYYY-MM-DD HH:mm:ss'),
				visited_foto: `images/checkin/${file.name}`,
				visited_objective: req.body.objective,
				visited_upd_by: authUser.usernama,
				visited_upd_date: moment().format('YYYY-MM-DD HH:mm:ss')
			}, {
				where: {
					visited_oid: req.params.visited_oid
				}
			})

			await this.updateStatusSchedule(req.body.visit_code)

			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil checkin'
				})
		} catch (error) {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal upload data',
					error: error.message
				})
		}
	}

	checkOut = async (req, res) => {
		let authUser = await helper.auth(req.get('authorization'))

		VisitedDet.update({
			visited_lat_gps_check_out: req.body.checkout_lat,
			visited_long_gps_check_out: req.body.checkout_long,
			visited_address_gps_check_out: req.body.checkout_address,
			visited_check_out: moment().format('YYYY-MM-DD HH:mm:ss'),
			visited_result: req.body.result,
			visited_output: req.body.output,
			visited_upd_by: authUser.usernama,
			visited_upd_date: moment().format('YYYY-MM-DD HH:mm:ss')
		}, {
			where: {
				visited_oid: req.params.visited_oid
			}
		}).then(result => {
			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil checkout',
					data: result
				})
		}).catch(err => {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal checkout',
					error: err.message
				})
		})
	}

	deleteFromListSchedule = (req, res) => {
		VisitedDet.destroy({
			where: {
				visited_oid: req.params.visited_oid
			}
		}).then(result => {
			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil menghapus data dari list jadwal',
					data: result
				})
		}).catch(err => {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal menghapus data dari list jadwal',
					error: err.message
				})
		})
	}

	deleteSchedule = (req, res) => {
		VisitMstr.destroy({
			where: {
				visit_code: req.params.visit_code
			}
		}).then(result => {
			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil menghapus jadwal',
					data: result
				})
		}).catch(err => {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal menghapus jadwal',
					error: err.message
				})
		})
	}

	getCustomerPerPeriode = async (req, res) => {
		try {
			let customer = await PtnrMstr.findAll({
				where: {
					ptnr_id: {
						[Op.in]: Sequelize.literal(`(SELECT plansd_ptnr_id FROM public.plansd_det WHERE plansd_plans_oid = (SELECT plans_oid FROM public.plans_mstr WHERE plans_periode = (SELECT periode_code FROM public.psperiode_mstr WHERE periode_start_date = '${moment().startOf('month').format('YYYY-MM-DD')}')))`)
					}
				},
				attributes: ['ptnr_name', 'ptnr_id']
			})

			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil mengambil data kostumer per periode',
					data: customer
				})
		} catch (error) {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal mengambil data kostumer per periode',
					error: error.message
				})
		}
	}

	getVisitType = (req, res) => {
		CodeMstr.findAll({
			where: {
				code_field: 'visiting'
			},
			order: [['code_default', 'desc']],
			attributes: ['code_oid', 'code_id', 'code_field', 'code_code', 'code_name', 'code_desc']
		}).then(result => {
			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil mengambil data',
					data: result
				})
		}).catch(err => {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal mengambil data',
					error: err.message
				})
		})
	}

	getOutputVisitType = (req, res) => {
		CodeMstr.findAll({
			where: {
				code_field: 'output-visiting'
			},
			order: [['code_default', 'desc']],
			attributes: ['code_oid', 'code_id', 'code_field', 'code_code', 'code_name', 'code_desc']
		}).then(result => {
			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil mengambil data',
					data: result
				})
		}).catch(err => {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal mengambil data',
					error: err.message
				})
		})
	}

	getSalesPerPeriode = async (req, res) => {
		try {
			let authUser = await helper.auth(req.get('authorization'))

			let where = {
				ptnr_id: {
					[Op.in]: Sequelize.literal(`(SELECT plansd_ptnr_id FROM public.plansd_det WHERE plansd_plans_oid = (SELECT plans_oid FROM public.plans_mstr WHERE plans_sales_id = ${authUser.user_ptnr_id} AND plans_periode = '${req.params.periode}'))`)
				}
			}

			if (req.query.search) {where.ptnr_name = {[Op.like]: `%${req.query.search}%`}}

			let dataSales = await PtnrMstr.findAll({
				attributes: [
					['ptnr_id', 'id'],
					['ptnr_name', 'name']
				],
				where: where
			})

			res.status(200)
				.json({
					status: 'success!',
					data: dataSales,
					error: null
				})
		} catch (error) {
			res.status(400)
				.json({
					status: error.message,
					data: null,
					error: error.stack
				})
		}
	}

	updateStatusSchedule = async (visit_code) => {
		let allCustomer = await VisitedDet.count({
			where: {
				visited_visit_code: {
					[Op.eq]: visit_code
				}
			}
		})
	
		let visitedToCustomer = await VisitedDet.count({
			where: {
				visited_visit_code: {
					[Op.eq]: visit_code
				},
				visited_check_in: {
					[Op.not]: null
				}
			}
		})
	
		if (allCustomer - visitedToCustomer == 0) {
			await VisitMstr.update({
				visit_status: 'Y'
			}, {
				where: {
					visit_code: {
						[Op.eq]: visit_code
					}
				}
			})
	
			return
		} else {
			return
		}
	}

	generateVisitCode = async (en_id) => {
		let visitCode = await VisitMstr.findOne({
			order: [['visit_add_date', 'desc']]
		})
	
		let totalPlannigSchedule = (!visitCode) ? 1 : parseInt(visitCode.visit_code.substring(12)) + 1
	
		return `VST0${en_id}456${moment().format('MMYY')}${totalPlannigSchedule}`
	}
}

module.exports = new VisitController()