const {PtnrgGrp, PtnrMstr, PsPeriodeMstr} = require('../../models')
const {Op} = require('sequelize')
const moment = require('moment')

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
    }
}

module.exports = MasterController