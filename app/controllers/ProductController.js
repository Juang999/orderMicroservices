const {PtMstr, EnMstr, CodeMstr, PidDet, PiddDet, InvcMstr, PtCatMstr, PtsCatCat, SizeMstr, Sequelize, PiMstr, LocMstr} = require('../../models')
const {Op} = require('sequelize')
const sequelize = require('sequelize')
const cryptr = require('cryptr')
const { read } = require('fs')
const crypter = new cryptr('thisIsSecretPassword')

const ProductController = {
    getProductByPriceCategory: async (req, res) => {
        try {
            let page = (req.query.page == null) ? 1 : req.query.page

            let limit = 10
            let offset = (page * limit) - limit
            let whereSubquery = (req.query.pi_oid) ? `WHERE pid_pi_oid = '${req.query.pi_oid}'` : ''
            
            let where = {
                pt_id: {
                    [Op.in]: Sequelize.literal(`(SELECT DISTINCT(pid_pt_id) FROM public.pid_det ${whereSubquery})`)
                }
            }

            let wherePricelist = (req.query.pi_oid) ? {pi_oid: req.query.pi_oid} : '';

            if (req.query.entity) where.pt_en_id = {[Op.eq]: req.query.entity}
            if (req.query.category) where.pt_cat_id = {[Op.eq]: req.query.category}
            if (req.query.query) where.pt_desc1 = {[Op.like]: `%${req.query.query}%`}
            if (req.query.subcategory) where.pt_ptscat_id = {[Op.eq]: req.query.subcategory}

            let {count, rows} = await PtMstr.findAndCountAll({
                        limit: limit,
                        offset: offset,
                        attributes: ['pt_desc2', 'pt_desc1', 'pt_clothes_id', 'pt_en_id', 'pt_id'],
                        order: [['pt_desc2', 'asc']],
                        where: where,
                        include: [
                            {
                                model: EnMstr,
                                as: 'EnMstr',
                                attributes: ['en_id', 'en_desc'],
                            }, {
                                model: PtCatMstr,
                                as: 'category_product',
                                attributes: [['ptcat_desc', 'category']]
                            }, {
                                model: PtsCatCat,
                                as: 'sub_category',
                                attributes: [['ptscat_desc', 'sub_category']]
                            }, {
                                model: PidDet,
                                as: 'price',
                                attributes: ['pid_pt_id', 'pid_pi_oid'],
                                include: [
                                    {
                                        model: PiMstr,
                                        as: 'price_list',
                                        attributes: ['pi_oid', 'pi_desc'],
                                        where: wherePricelist
                                    }
                                ]
                            }
                        ]
                    })

            let result = {
                data: rows,
                totalData: rows.length,
                page: page,
                totalPage: Math.ceil(count/limit)
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
    showProductByPriceCategory: (req, res) => {
        let entityWarehouse

        if (req.params.entity == 1) {entityWarehouse = 10001}
        if (req.params.entity == 2) {entityWarehouse = 200010}
        if (req.params.entity == 3) {entityWarehouse = 30008}

        PtMstr.findOne({
            where: {
                [Op.and]: {
                    pt_id: {
                        [Op.eq]: req.params.pt_id
                    },
                }
            },
            attributes: ['pt_id', 'pt_desc1', 'pt_desc2', 'pt_clothes_id'],
            include: [
                {
                    model: EnMstr,
                    as: 'EnMstr',
                    attributes: ['en_id', 'en_desc']
                },{
                    model: PidDet,
                    as: 'price',
                    attributes: ['pid_oid', 'pid_pt_id', 'pid_pi_oid'],
                    where: {
                        pid_pi_oid: req.params.pi_oid
                    },
                    include: [
                        {
                            model: PiMstr,
                            as: 'price_list',
                            attributes: ['pi_oid', 'pi_desc']
                        }, {
                            model: PiddDet,
                            as: 'detail_price',
                            attributes: ['pidd_price', 'pidd_disc'],
                            include: [
                                {
                                    model: CodeMstr,
                                    as: 'PaymentType',
                                    attributes: ['code_code', 'code_id', 'code_desc']
                                }
                            ]
                        }
                    ]
                }, {
                    model: PtCatMstr,
                    as: 'category_product',
                    attributes: ['ptcat_desc']
                }, {
                    model: PtsCatCat,
                    as: 'sub_category',
                    attributes: ['ptscat_desc']
                }, {
                    model: CodeMstr,
                    as: 'color',
                    attributes: ['code_desc']
                }, {
                    model: SizeMstr,
                    as: 'size',
                    attributes: ['size_desc']
                }
            ]
        }).then( async result => {            
            let location = await InvcMstr.findOne({
                where: {
                    invc_loc_id: entityWarehouse
                },
                attributes: ['invc_qty_available'],
                include: [
                    {
                        model: LocMstr,
                        as: 'location',
                        attributes: ['loc_id', 'loc_desc']
                    }
                ]
            })

            if (location) {
                result.dataValues.status = 'DIJUAL'
                result.dataValues.Qty = location
            } else {
                result.dataValues.status = 'PRE-ORDER'
                result.dataValues.Qty = []
            }

            res.status(200)
                .json({
                    status: "berhasil",
                    message: "berhasil mengambil detail data",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "gagal",
                    message: "gagal mengambil detail data",
                    error: err.message
                })
        })
    },
    showProductByLocation: (req, res) => {
        let idLocation

        if (req.params.entity == 1) {idLocation = 10001}
        if (req.params.entity == 2) {idLocation = 200010}
        if (req.params.entity == 3) {idLocation = 300018}

        PtMstr.findOne({
            where: {
                [Op.and]: {
                    pt_id: {
                        [Op.eq]: req.params.pt_id
                    },
                }
            },
            attributes: ['pt_id', 'pt_desc1', 'pt_desc2', 'pt_clothes_id'],
            include: [
                {
                    model: EnMstr,
                    as: 'EnMstr',
                    attributes: ['en_id', 'en_desc']
                },{
                    model: PidDet,
                    as: 'price',
                    attributes: ['pid_oid', 'pid_pt_id', 'pid_pi_oid'],
                    include: [
                        {
                            model: PiMstr,
                            as: 'price_list',
                            attributes: ['pi_oid', 'pi_desc']
                        }, {
                            model: PiddDet,
                            as: 'detail_price',
                            attributes: ['pidd_price', 'pidd_disc'],
                            include: [
                                {
                                    model: CodeMstr,
                                    as: 'PaymentType',
                                    attributes: ['code_code', 'code_id', 'code_desc']
                                }
                            ]
                        }
                    ]
                }, {
                    model: InvcMstr,
                    as: 'Qty',
                    attributes: ['invc_qty_available'],
                    include: [
                        {
                            model: LocMstr,
                            as: 'location',
                            attributes: ['loc_id', 'loc_desc'],
                            where: {
                                loc_id: idLocation
                            }
                        }
                    ]
                }, {
                    model: PtCatMstr,
                    as: 'category_product',
                    attributes: ['ptcat_desc']
                }, {
                    model: PtsCatCat,
                    as: 'sub_category',
                    attributes: ['ptscat_desc']
                }, {
                    model: CodeMstr,
                    as: 'color',
                    attributes: ['code_desc']
                }, {
                    model: SizeMstr,
                    as: 'size',
                    attributes: ['size_desc']
                }
            ]
        }).then(result => {
            res.status(200)
                .json({
                    status: "berhasil",
                    message: "berhasil mengambil detail data",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "gagal",
                    message: "gagal mengambil detail data",
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
    showPriceAndQty: async (req, res) => {
        PiMstr.findAll({
            attributes: ['pi_oid', 'pi_desc', 'pi_start_date', 'pi_end_date']
        }).then(result => {
            res.status(200)
                .json({
                    status: "berhasil",
                    message: "berhasil mengambil data price list",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "gagal",
                    message: "gagal mengambil data price list",
                    error: err.message
                })
        })
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

        let where = {pt_pl_id: 1, pt_desc1: {[Op.not]: null}}
        console.log(where)
    
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
                        [Op.or]: [
                            {
                                invc_loc_id: {
                                    [Op.eq]: 10001
                                },
                            },{
                                invc_loc_id: {
                                    [Op.eq]: 300018
                                },
                            },{
                                invc_loc_id: {
                                    [Op.eq]: 200010
                                }
                            }
                        ],
                    },
                    required: false
                }
            ],
            raw: true,
            nest: true,
            distinct: true
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
    },
    getProductByLocation: (req, res) => {
        let page = (req.query.page == null) ? 1 : req.query.page

            let limit = 10
            let offset = (page * limit) - limit
            let whereLocation = (req.query.loc_id) ? req.query.loc_id : [10001, 200010, 300018]

            if (req.query.query) where.pt_desc1 = {[Op.like]: `%${req.query.query}%`}
            if (req.query.category) where.pt_cat_id = {[Op.eq]: req.query.category}
            if (req.query.subcategory) where.pt_ptscat_id = {[Op.eq]: req.query.subcategory}
            if (req.query.entity) where.pt_en_id = {[Op.eq]: req.query.entity}

            PtMstr.findAndCountAll({
                    limit: limit,
                    offset: offset,
                    attributes: ['pt_desc2', 'pt_desc1', 'pt_clothes_id', 'pt_en_id', 'pt_id'],
                    order: [['pt_desc2', 'asc']],
                    where: {
                        pt_id: {
                            [Op.in]: Sequelize.literal(`(SELECT DISTINCT(invc_pt_id) FROM public.invc_mstr WHERE invc_loc_id IN (${whereLocation}))`)
                        }
                    },
                    include: [
                        {
                            model: EnMstr,
                            as: 'EnMstr',
                            attributes: ['en_id', 'en_desc'],
                        }, {
                            model: PtCatMstr,
                            as: 'category_product',
                            attributes: [['ptcat_desc', 'category']]
                        }, {
                            model: PtsCatCat,
                            as: 'sub_category',
                            attributes: [['ptscat_desc', 'sub_category']]
                        }, {
                            model: InvcMstr,
                            as: 'Qty',
                            attributes: ['invc_oid', 'invc_pt_id', 'invc_loc_id'],
                            where: {
                                invc_loc_id: {
                                    [Op.in]: whereLocation
                                }
                            },
                            include: [
                                {
                                    model: LocMstr,
                                    as: 'location',
                                    attributes: ['loc_id', 'loc_desc']
                                }
                            ]
                        }
                    ],
                    distinct: true
                }).then(result => {
                    let theResult = {
                        data: result.rows,
                        totalData: result.rows.length,
                        page: page,
                        totalPage: Math.ceil(result.count/limit)
                    }

                    res.status(200)
                        .json({
                            status: "berhasil",
                            message: "berhasil mengambil data produk berdasarkan lokasi",
                            data: theResult
                        })
                }).catch(err => {
                    console.log(err)
                    res.status(400)
                        .json({
                            status: 'gagal',
                            message: 'gagal mengambil data produk berdasarkan lokasi',
                            error: err.message
                        })
                })

    }
}

module.exports = ProductController