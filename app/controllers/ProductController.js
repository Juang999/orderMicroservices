const {PtMstr, EnMstr, CodeMstr, PidDet, PiddDet, InvcMstr} = require('../../models')
const {Op} = require('sequelize')
const sequelize = require('sequelize')
const cryptr = require('cryptr')
const crypter = new cryptr('thisIsSecretPassword')

const ProductController = {
    index: async (req, res) => {
        let offset = req.query.page * 10 - 10
        let limit = 10

        PtMstr.findAll({
            limit: limit,
            offset: offset,
            attributes: ['pt_id', 'pt_desc1', 'pt_desc2', 'pt_clothes_id'],
            order: [['pt_add_date', 'desc']],
            where: {
                pt_pl_id: 1
            },
            include: [{
                model: EnMstr,
                as: 'EnMstr',
                attributes: ['en_desc']
            }]
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
        })
        .catch(err => {
            res.status(400)
                .json({
                    status: "gagal",
                    message: "gagal mengambil data",
                    error: err.message
                })
        })
    },
    show: (req, res) => {
        PtMstr.findAll({
            where: {
                pt_desc2: req.params.pt_desc2
            },
            include: [
                {
                    model: EnMstr,
                    as: 'EnMstr',
                    attributes: ['en_id', 'en_desc']
                }
            ],
            attributes: ['pt_desc2', 'pt_clothes_id', 'pt_code_color_id']
        }).then( async result => {
            let colorId = []

            for (const product of result) {
                colorId.push(product.dataValues.pt_code_color_id)
            }

            let colorData = await CodeMstr.findAll({
                where: {
                    code_id: {
                        [Op.in]: colorId
                    }
                },
                attributes: ['code_id', 'code_name']
            })

            let data = {
                data: result[0].dataValues,
                color: colorData
            }

            res.status(200)
            .json({
                status: "berhasil",
                message: "berhasil mengambli data",
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
    showSize: (req, res) => {
        CodeMstr.findAll({
            where: {
                code_id: {
                    [Op.eq]: sequelize.literal(`(SELECT pt_size_code_id FROM public.pt_mstr WHERE (pt_desc2 = '${req.params.product}' AND pt_code_color_id = ${req.params.pt_code_color_id}))`)
                }
            },
            attributes: ['code_id', 'code_name']
        }).then(result => {
            res.status(200)
                .json({
                    status: "success",
                    message: "success to get size",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "failed",
                    message: "failed to get size",
                    error: err.message
                })
        })
    },
    showPrinceAndQty: async (req, res) => {
        try {
            let product = await PtMstr.findOne({
                where: {
                    [Op.and]: [
                        {pt_desc2: req.params.product},
                        {pt_code_color_id: req.params.pt_code_color_id},
                        {pt_size_code_id: req.params.pt_size_code_id}
                    ]
                },
                attributes: ['pt_id']
            })

            let query = [
                `(SELECT pid_oid FROM public.pid_det WHERE pid_pi_oid = '${req.params.pi_oid}' and pid_pt_id = ${product.pt_id})`
            ]

            let price = await PiddDet.findAll({
                where: {
                    pidd_pid_oid: {
                        [Op.eq]: sequelize.literal(query[0])
                    }
                },
                attributes: ['pidd_price', 'pidd_payment_type', 'pidd_disc'],
                include: [
                    {
                        model: CodeMstr,
                        as: "PaymentType",
                        attributes: ["code_name"]
                    }
                ]
            })

            if (req.params.en_id == 1) var warehouse = 991
            if (req.params.en_id == 2) var warehouse = 20004
            if (req.params.en_id == 3) var warehouse = 992 

            let rawStock = await InvcMstr.findOne({
                where: {
                    [Op.and]: [
                        {invc_pt_id: product.pt_id},
                        {invc_loc_id: warehouse}
                    ]
                }
            })

            if (rawStock != null) {
                stock = (rawStock.invc_qty_show_available != null) ? Math.ceil(rawStock.invc_qty * rawStock.invc_qty_show_available) : 0
            } else {
                stock = 0
            }

            let data  = {
                price: price,
                stock: stock
            }

            res.status(200)
                .json({
                    status: "success",
                    message: "success to get data",
                    data: data
                })
        } catch (error) {
            res.status(400)
                .json({
                    status: "failed",
                    message: "failed to get data",
                    error: error.message
                })
        }
    }
}

module.exports = ProductController