const {PtnrgGrp, PtnrMstr, PsPeriodeMstr, CodeMstr, CuMstr} = require('../../models')
const {Op, Sequelize} = require('sequelize')
const moment = require('moment')
const helper = require('../../helper/helper')

const MasterController = {
    getGroup: (req, res) => {
        PtnrgGrp.findAll({
            attributes: ['ptnrg_id', 'ptnrg_name']
        }).then(result => {
            res.status(200)
                .json({
                    status: "success",
                    message: "success to get data group",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "failed",
                    message: "failed to get data group",
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
                    status: "success",
                    message: "berhasil mengambil data",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "failed",
                    message: "gagal mengambil data",
                    error: err.message
                })
        })
    },
    getPeriode: async (req, res) => {
        try {
            let rawPeriodes = await PsPeriodeMstr.findAll({
                attributes: ['periode_code', 'periode_id']
            })
    
            let periode = []

            for (const rawPeriode of rawPeriodes) {
                periode.push({
                    periode_code: rawPeriode.periode_code,
                    periode_month: moment.months(rawPeriode.periode_id - 1)
                })
            }

            res.status(200)
                .json({
                        status: "success",
                        message: "berhasil mengambil data",
                        data: periode
                    })
        } catch (error) {
            res.status(400)
                .json({
                        status: "failed",
                        message: "gagal mengambil data",
                        error: error.message
                    })
        }
    },
    getPeriodeSales: async (req, res) => {
        let auth = await helper.auth(req.get('authorization'))
        
        PsPeriodeMstr.findAll({
            where: {
                periode_code: {
                    [Op.eq]: Sequelize.literal(`(SELECT plans_periode FROM public.plans_mstr WHERE plans_sales_id = ${auth.user_ptnr_id})`)
                }
            },
            attributes: ["periode_code", 'periode_start_date', 'periode_end_date', "periode_id"]
        }).then(results => {

            let data = []

            for (const result of results) {
                data.push({
                    periode_code: result.periode_code,
                    periode_month: moment.months(result.periode_id - 1) + ' ' + moment(result.periode_start_date, 'YYYY-MM-DD').year()
                })
            }
            res.status(200)
                .json({
                    status: "success",
                    message: "berhasil mengambil data",
                    data: data
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "failed",
                    message: "gagal mengambil data",
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
                    status: "success",
                    message: "berhasil mengambil data",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "failed",
                    message: "gagal mengmabil data",
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
                    status: "success",
                    message: "berhasil mengambil data",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "failed",
                    message: 'gagal menmgambil data',
                    error: err.message
                })
        })
    },
    getContactPerson: (req, res) => {
        CodeMstr.findAll({
            where: {
                code_field: "ptnrac_function"
            },
            attributes: ['code_id', 'code_name']
        }).then(result => {
            res.status(200)
                .json({
                    status: "success",
                    message: "berhasil mengambil data",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "failed",
                    message: "gagal mengambil data",
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
                    status: "success",
                    message: "berhasil mengambil data",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "failed",
                    message: "gagal mengambil data",
                    error: err.message
                })
        })
    },
    getCitizen: (req, res) => {
        CodeMstr.findAll({
            where: {
                code_field: "WNegara"
            },
            attributes: ['code_id', 'code_name']
        }).then(result => {
            res.status(200)
                .json({
                    status: "success",
                    message: "berhasil mengambil data",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "failed",
                    message: "gagal mengambil data",
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
                    status: "success",
                    message: "berhasil mengambil data",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "failed",
                    message: "gagal menngambil data",
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
                    status: "success",
                    message: "berhasil mengambil data",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "failed",
                    message: "gagal mengambil data",
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
                    message: "berhasil mengambil data",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "failed",
                    message: "gagal mengambil data",
                    error: err.message
                })
        })
    }
}

module.exports = MasterController