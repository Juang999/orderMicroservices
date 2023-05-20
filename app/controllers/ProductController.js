const {PtMstr, EnMstr, CodeMstr, PidDet, PiddDet, InvcMstr, PtCatMstr, PtsCatCat, SizeMstr, Sequelize} = require('../../models')
const {Op} = require('sequelize')
const sequelize = require('sequelize')
const cryptr = require('cryptr')
const crypter = new cryptr('thisIsSecretPassword')

const ProductController = {
    index: async (req, res) => {
        try {
            let page = (req.query.page == null) ? 1 : req.query.page

            let offset = page * 10 - 10
            let limit = 10
            
            let where = {
                pt_pl_id: 1,
                pt_size_id: {
                    [Op.gt]: 0
                },
                pt_code_color_id: {
                    [Op.gt]: 0
                },
                pt_cat_id: {
                    [Op.gt]: 0
                },
                pt_ptscat_id: {
                    [Op.gt]: 0
                },
                pt_desc2: {
                    [Op.not]: null
                }
            }

            if (req.query.query) where.pt_desc2 = {[Op.like]: `%${req.query.query}%`} 

            let datas = await PtMstr.findAll({
                        limit: limit,
                        offset: offset,
                        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('pt_desc2')), 'pt_desc2'], 'pt_clothes_id', 'pt_en_id'],
                        order: [['pt_desc2', 'desc']],
                        where: where,
                    })

            for (const data of datas) {
                data.dataValues.EnMstr = await EnMstr.findOne({
                    where: {
                        en_id: data.pt_en_id
                    },
                    attributes: ['en_desc']
                })
            }

            let result = {
                data: datas,
                totalData: limit,
                page: req.query.page
            }
    
            res.status(200)
                .json({
                    status: "berhasil",
                    message: "berhasil mengambil data",
                    data: result
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
        SizeMstr.findAll({
            where: {
                size_id: {
                    [Op.in]: sequelize.literal(`(SELECT pt_size_id FROM public.pt_mstr WHERE (pt_desc2 = '${req.params.product}' AND pt_code_color_id = ${req.params.pt_code_color_id}))`)
                }
            },
            attributes: ['size_id', 'size_name'],
            order: [['size_id', 'asc']]
        })
        .then(result => {
            res.status(200)
                .json({
                    status: "success",
                    message: "berhasil mengambil data",
                    data: result
                })
        })
        .catch(err => {
            res.status(400)
                .json({
                    status: "failed",
                    message: "gagal mengambil data",
                    error: err.message
                })
        })
    },
    showGrade: (req, res) => {
        PtMstr.findAll({
            where: {
                [Op.and]: [
                    {pt_desc2: req.params.product},
                    {pt_size_id: req.params.size_id},
                    {pt_code_color_id: req.params.color_id}
                ]
            },
            attributes: ['pt_class']
        })
        .then(result => {
            res.status(200)
                .json({
                    status: "success",
                    message: "berhasil mengambil data grade",
                    data: result
                })
        })
        .catch(err => {
            res.status(400)
                .json({
                    status: "failed",
                    message: "gagal mengambil data grade",
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
                        {pt_size_id: req.params.pt_size_code_id},
                        {pt_class: req.params.grade}
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
            console.log(error)
            res.status(400)
                .json({
                    status: "failed",
                    message: "failed to get data",
                    error: error.message
                })
        }
    },
    getCategory: (req, res) => {
        PtCatMstr.findAll({
            attributes: ['ptcat_id', 'ptcat_desc']
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
    getSubCategory: (req, res) => {
        console.log(req.params.cat_id)
        PtsCatCat.findAll({
            attributes: ["ptscat_id", "ptscat_desc"],
            where: {
                ptscat_ptcat_id: req.params.cat_id
            }
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
    getSize: (req, res) => {
        SizeMstr.findAll({
            attributes: ["size_id", "size_code", "size_name", "size_desc"]
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
    getProductWithCategory: (req, res) => {
        let page = (req.query.page) ? req.query.page : 1
        let offset = page * 10 - 10
        let limit = 10
        
        PtMstr.findAll({
            where: {
                pt_group: req.params.category_id
            },
            attributes: ['pt_id', 'pt_desc1', 'pt_desc2', 'pt_clothes_id'],
            include: [
                {
                    model: CodeMstr,
                    as: "category",
                    attributes: ["code_name"]
                }
            ],
            limit: limit,
            offset: offset
        }).then(result => {
            let data = {
                theData: result,

                page: page,
                data: 10
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
                    messgae: "gagal mengambil data",
                    error: err.message
                })
        })
    },
    getAllProduct: (req, res) => {
        let page = (req.query.page) ? req.query.page : 1
        let limit = 20
        let offset = (limit * page) - limit

        let where = {pt_pl_id: 1}
        let whereLocation = {invc_loc_id: {[Op.in]: [10001, 300018, 200010]}}
    
        if (req.query.entity > 0) where.pt_en_id = req.query.entity
        if (req.query.query) where.pt_desc2 = {[Op.like]: `%${req.query.query}%`}
        if (req.query.category) where.pt_cat_id = req.query.category

        PtMstr.findAndCountAll({
            limit: limit,
            offset: offset,
            attributes: ['pt_code', 'pt_desc1'],
            where: where,
            order: [['pt_desc1', 'asc']],
            include: [
                {
                    model: EnMstr,
                    as: 'EnMstr',
                    attributes: ['en_desc']
                },
                {
                    model: PtCatMstr,
                    as: 'category_product',
                    attributes: ['ptcat_desc']
                },
                {
                    model: InvcMstr,
                    as: 'Qty',
                    attributes: ['invc_qty_available'],
                    where:{
                        [Op.or]: {
                            invc_loc_id: 10001,
                            invc_loc_id: 300018,
                            invc_loc_id: 200010
                        },
                    },
                    required: false
                }
            ],
            raw: true,
            nest: true
        }).then(results => {
            for (const result of results.rows) {

                if (result.Qty.invc_qty_available == null) {
                    result.Qty.invc_qty_available = '0.00000000'
                }

                if (result.category_product.ptcat_desc == null) {
                    result.category_product.ptcat_desc = '-'
                }

                if (result.pt_cat_id == null) {
                    result.pt_cat_id = '-'
                }
            }

            let data = {
                product: results.rows,
                page: page,
                totalData: results.rows.length,
                totalPage: Math.ceil(results.count / limit)
            }

            res.status(200)
                .json({
                    status: "berhasil",
                    message: "berhasil mengambil data produk",
                    data: data
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "gagal",
                    message: "gagal mengambil data produk",
                    error: err.message
                })
        })
    }
}

module.exports = ProductController