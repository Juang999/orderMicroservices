const {SqMstr, SqdDet, SiMstr, LocMstr} = require('../../models')
const {Op} = require('sequelize')

const SalesQuotationController = {
    getSite: (req, res) => {
        SiMstr.findAll({
            attributes: ['si_id', 'si_desc']
        })
        .then(result => {
            res.status(200)
                .json({
                    status: "berhasil",
                    message: "berhasil mengambil data si",
                    data: result
                })
        })
        .catch(error => {
            res.status(400)
                .json({
                    status: "gagal",
                    message: "gagal mengambil data si",
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
                    status: "berhasil",
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
    }
}

module.exports = SalesQuotationController