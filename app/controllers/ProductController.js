const {PtMstr} = require('../../models')

const ProductController = {
    index: (req, res) => {
        let offset = req.query.page * 15
        let limit = 15

        PtMstr.findAll({
            attributes: ['pt_id', 'pt_desc1'],
            limit: limit,
            offset: offset
        }).then(result => {
            let data = {
                data: result,
                totalData: 15,
                page: req.query.page
            }

            res.status(200)
                .json({
                    status: "berhasil",
                    message: "berhasil mengambil data",
                    data: data
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "gagal",
                    message: "gagal mengambil data",
                    error: err.message
                })
        })
    },
    show: (req, res) => {
        PtMstr.findOne({
            where: {
                pt_id: req.params.pt_id
            },
            attributes: ['pt_id', 'pt_clothes_id']
        }).then(result => {
            res.status(200)
                .json({
                    status: "berhasil",
                    message: "berhasil mengambli data",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "gagal",
                    message: "gagal mengambil data",
                    error: err.message
                })
        })
    }
}

module.exports = ProductController