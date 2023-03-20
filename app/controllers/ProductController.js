const {PtMstr, PiMstr, PidDet, PiddDet, InvcMstr, EnMstr, sequelize} = require('../../models')
const rawSequelize = require('../../config/connection')

const ProductController = {
    index: async (req, res) => {
        let offset = req.query.page * 10
        let limit = 10

        PtMstr.findAll({
            limit: limit,
            offset: offset,
            attributes: ['pt_id', 'pt_desc1', 'pt_clothes_id'],
            include: 'EnMstr'
        })
                    .then(result => {
                        let data = {
                            data: result,
                            totalData: limit,
                            page: req.query.page
                        }

                        res.status(200)
                            .json({
                                status: "berhasil",
                                message: "berhasil mengambil data",
                                data: data
                            })
                    }).catch(err => {
                        console.log(err)
                        console.log(err.original)
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
            attributes: ['pt_en_id','pt_id', 'pt_clothes_id']
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
    },
    detailProduct: async (req, res) => {
        try {
            let entity = await EnMstr.findOne({
                where: {
                    en_id: req.params.en_id
                }
            })

            InvcMstr.findOne({
                where: {
                    invc_loc_id: {
                        include: [

                        ]
                    }
                }
            })
        } catch (error) {
            
        }
    }
}

module.exports = ProductController