const {SqMstr, SqdDet, SiMstr, LocMstr} = require('../../models')
const {Op} = require('sequelize')
const helper = require('../../helper/helper')
const {v4: uuidv4} = require('uuid')
const moment = require('moment')

const SalesQuotationController = {
	getSite: (req, res) => {
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
	},
	getLocation: (req, res) => {
		LocMstr.findAll({
			where: {
				loc_id: {
					[Op.in]: [10001, 1000122, 1000121, 10006, 1000191, 1000166, 100091]
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
	},
	getLocationTo: (req, res) => {
		LocMstr.findAll({
			attributes: ['loc_id', 'loc_desc']
		})
			.then(result => {
				res.status(200)
					.json({
						status: 'berhasil',
						message: 'berhasil mengambil data lokasi',
						data: result
					})
			})
			.catch(err => {
				res.status(400)
					.json({
						status: 'gagal',
						message: 'gagal mengambil data lokasi',
						error: err.message
					})
			})
	},
	createSalesQuotation: async (req, res) => {
		let authUser = await helper.auth(req.get('authorization'))

		let partner = await PtnrMstr.findOne({
			where: {
				ptnr_id: authUser.user_ptnr_id
			}
		})

		const sq_code = `SQ${partner.ptnr_en_id}${partner.ptnr_ptnrg_id}`
        
		SqMstr.create({
			sq_oid: uuidv4(),
			sq_dom_id: partner.ptnr_dom_id,
			sq_en_id: ptnr_en_id,
			sq_add_by: authUser.usernama,
			sq_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
			sq_code: sq_code,
			sq_ptnr_id_sold: req.body.sq_pptnr_id_sold,
			sq_ptnr_id_bill: req.body.sq_pptnr_id_bill,
			sq_date: moment().format('YYYY-MM-DD'),
			sq_si_id: req.body.si_id,
			sq_type: 'R',
			sq_sales_person: authUser.user_ptnr_id,
			sq_pi_id: req.body.pi_id,
			sq_pay_type: req.body.sq_pay_type,
			sq_pay_method: req.body.sq_pay_method,
			sq_dp: (req.body.sq_dp) ? req.body.sq_dp : 0,
			sq_disc_header: (req.body.sq_disc_header) ? req.body.sq_disc_header : 0,
			sq_total: req.body.sq_total,
			sq_close_date: moment(req.body.sq_close_date).format('YYYY-MM-DD'),
			sq_trans_id: req.body.sq_trans_id,
			sq_trans_rmks: (req.body.sq_trans_rmks) ? req.body.sq_trans_rmks : null,
			sq_dt: moment().format('YYYY-MM-DD HH:mm:ss'),
			sq_cu_id: req.body.sq_cu_id,
			sq_total_ppn: 0,
			sq_total_pph: 0,
			sq_payment: 0,
			sq_exc_rate: req.body.sq_exc_rate,  
			sq_tax_inc: null,
			sq_cons: req.body.sq_cons,
			sq_terbilang: req.body.sq_terbilang,
			sq_interval: 0,
			sq_need_date: req.body.sq_need_date,
			sq_is_package: req.body.sq_is_package,
			sq_sales_program: req.body.sq_sales_program,
			sq_booking: 'N',
			sq_book_start_date: moment().format('YYYY-MM-DD'),
			sq_book_end_date: moment().format('YYYY-MM-DD'),
			sq_alocated: req.body.sq_alocated,
			sq_ptsfr_loc_id: req.body.sq_loc_id,
			sq_ptsfr_loc_to_id: req.body.sq_loc_to_id,
			sq_ptsfr_loc_git: req.body.sq_loc_git,
			sq_en_to_id: 0,
			sq_si_to_id: req.body.sq_si_id,
		})
	}
}

module.exports = SalesQuotationController