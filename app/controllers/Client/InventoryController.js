const {PtMstr, SqMstr, SqdDet, PtsfrMstr, PtsfrdDet, PtnrMstr, LocMstr, EnMstr, InvcMstr, Sequelize, sequelize} = require('../../../models')
const {Op} = require('sequelize')
const {auth, page, Query: query} = require('../../../helper/helper')
let moment = require('moment')

class InventoryController {
    getInventoryTransferReceipt = async (req, res) => {
        try {
            let authUser = await auth(req.get('authorization'))
            let thePage = (req.query.page) ? req.query.page : 1

            let {limit, offset} = page(thePage, 20)
            let dataTransfer = await PtsfrMstr.findAll({
                attributes: [
                    ['ptsfr_oid', 'transfer_oid'],
                    ['ptsfr_loc_to_id', 'location_id'],
                    ['ptsfr_code', 'transfer_code'],
                    [Sequelize.col('entity.en_desc'), 'entity_name'],
                    [Sequelize.col('detail_location_purpose.loc_desc'), 'location_name'],
                    [Sequelize.literal(`CASE WHEN "detail_location_purpose->location_owner"."ptnr_name" IS NOT NULL THEN "detail_location_purpose->location_owner"."ptnr_name" ELSE '-' END`), 'receiver_name'],
                    [Sequelize.fn('SUM', Sequelize.col('detail_consigment_items.ptsfrd_qty')), 'qty_product'],
                    [Sequelize.fn('TO_CHAR', Sequelize.col('ptsfr_date'), 'YYYY-MM-DD HH:mi:ss'), 'date'],
                ],
                include: [
                    {
                        model: LocMstr,
                        as: 'detail_location_purpose',
                        attributes: [],
                        include: [
                            {
                                model: PtnrMstr,
                                as: 'location_owner',
                                attributes: []
                            }
                        ]
                    }, {
                        model: PtsfrdDet,
                        as: 'detail_consigment_items',
                        required: true,
                        duplicating: false,
                        attributes: []
                    }, {
                        model: EnMstr,
                        as: 'entity',
                        attributes: []
                    }
                ],
                where: {
                    [Op.or]: [
                        {
                            ptsfr_loc_to_id: {
                                [Op.in]: Sequelize.literal(`(SELECT loc_id FROM public.loc_mstr WHERE loc_ptnr_id IN (SELECT ptnr_id FROM public.ptnr_mstr WHERE ptnr_parent IN (SELECT dbgd_ptnr_id FROM public.dbgd_det WHERE dbgd_dbg_oid = (SELECT dbgd_dbg_oid FROM public.dbgd_det WHERE dbgd_ptnr_id = ${authUser.user_ptnr_id}))))`),
                            },
                        }, {
                            ptsfr_loc_to_id: {
                                [Op.in]: Sequelize.literal(`(SELECT loc_id FROM public.loc_mstr WHERE loc_ptnr_id IN (SELECT dbgd_ptnr_id FROM public.dbgd_det WHERE dbgd_dbg_oid = (SELECT dbgd_dbg_oid FROM public.dbgd_det WHERE dbgd_ptnr_id = ${authUser.user_ptnr_id})))`)
                            }
                        }
                    ],
                    ptsfr_trans_id: {
                        [Op.eq]: (req.query.is_complete == 'Y') ? 'C' : 'D'
                    },
                    ptsfr_sq_oid: {
                        [Op.is]: Sequelize.literal('NOT NULL')
                    },
                    ptsfr_date: {
                        [Op.between]: [
                            moment(req.query.start_date).format('YYYY-MM-DD'),
                            moment(req.query.end_date).format('YYYY-MM-DD')
                        ]
                    }
                },
                limit: limit,
                offset: offset,
                order: [
                    ['ptsfr_date', 'desc']
                ],
                group: [
                    'ptsfr_oid',
                    'location_name',
                    'receiver_name',
                    'entity_name'
                ]
            })

            res.status(200)
                .json({
                    status: 'success!',
                    data: dataTransfer,
                    error: null
                })
        } catch (error) {
            res.status(400)
                .json({
                    status: 'failed',
                    data: null,
                    error: error.message
                })
        }
    }

    detailInventoryTransferReceipt = (req, res) => {
        PtsfrMstr.findOne({
            attributes: [
                'ptsfr_oid',
                'ptsfr_code',
                'ptsfr_loc_git',
                'ptsfr_loc_to_id',
                'ptsfr_booking',
                [Sequelize.literal(`CASE WHEN "detail_location_purpose->location_owner"."ptnr_name" IS NOT NULL THEN "detail_location_purpose->location_owner"."ptnr_name" ELSE '-' END`), 'receiver_name'],
                [Sequelize.fn('TO_CHAR', Sequelize.col('ptsfr_date'), 'YYYY-MM-DD'), 'ptsfr_dt'],
                [Sequelize.literal(`(SELECT SUM(ptsfrd_qty) FROM public.ptsfrd_det WHERE ptsfrd_ptsfr_oid = '${req.params.ptsfr_oid}')`), 'qty_product'],
                [Sequelize.fn('SUM', Sequelize.col('sales_quotation->detail_sales_quotation.sqd_price')), 'price'],
                [Sequelize.literal(`CASE WHEN ptsfr_trans_id = 'D' THEN 'uncheck' ELSE 'checked' END`), 'status']
            ],
            include: [
                {
                    model: LocMstr,
                    as: 'detail_location_purpose',
                    attributes: [],
                    include: [
                        {
                            model: PtnrMstr,
                            as: 'location_owner',
                            attributes: []
                        }
                    ]
                }, {
                    model: PtsfrdDet,
                    as: 'detail_consigment_items',
                    required: true,
                    duplicating: false,
                    attributes: [
                        'ptsfrd_oid',
                        [Sequelize.literal('"detail_consigment_items->detail_product"."pt_desc1"'), 'product_name'],
                        'ptsfrd_qty',
                        'ptsfrd_pt_id',
                        [Sequelize.literal('CASE WHEN ptsfrd_qty_receive IS NULL THEN 0 ELSE ptsfrd_qty_receive END'), 'qty_receive']
                    ],
                    include: [
                        {
                            model: PtMstr,
                            required: true,
                            duplicating: false,
                            as: 'detail_product',
                            attributes: []
                        }
                    ]
                }, {
                    model: SqMstr,
                    as: 'sales_quotation',
                    attributes: [],
                    required: true,
                    include: [
                        {
                            model: SqdDet,
                            required: false,
                            as: 'detail_sales_quotation',
                            attributes: []
                        }
                    ]
                }
            ],
            where: {
                ptsfr_oid: req.params.ptsfr_oid
            },
            group: [
                'ptsfr_oid',
                'receiver_name',
                'ptsfr_dt',
                'detail_consigment_items.ptsfrd_oid',
                'detail_consigment_items.ptsfrd_qty',
                '"detail_consigment_items->detail_product"."pt_desc1"'
            ], order: [
                [Sequelize.literal('"detail_consigment_items->detail_product"."pt_desc1"'), 'asc']
            ],
        }).then(result => {
            res.status(200)
                .json({
                    status: 'success',
                    data: result,
                    error: null
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: 'failed!',
                    data: null,
                    error: err.message
                })
        })
    }

    updateTransferReceipt = async (req, res) => {
        const authUser = await auth(req.headers['authorization'])
        let transaction = await sequelize.transaction()
        
        try {
            const detailTransferReceipt = JSON.parse(req.body.body_transfer_receipt)

            await PtsfrMstr.update({
                ptsfr_receive_date: moment().format('YYYY-MM-DD'),
                ptsfr_upd_by: authUser.usernama,
                ptsfr_trans_id: 'C',
                ptsfr_upd_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }, {
                where: {
                    ptsfr_oid: req.params.ptsfr_oid
                },
                logging: async (sql, queryObject) => {
                    let value = queryObject.bind
                    
                    await query.insert(sql, {
                        bind: {
                            $1: value[0],
                            $2: value[1],
                            $3: value[2],
                            $4: value[3],
                            $5: value[4]
                        }
                    })
                }
            })

            for (const detailData of detailTransferReceipt) {
                await PtsfrdDet.update({
                    ptsfrd_qty_receive: detailData.ptsfrd_qty_receive,
                    ptsfrd_upd_by: authUser.usernama,
                    ptsfrd_upd_date: moment().format('YYYY-MM-DD HH:ii:ss')
                }, {
                    where: {
                        ptsfrd_oid: detailData["ptsfrd_oid"]
                    },
                    logging: (sql, queryObject) => {
                        let value = queryObject.bind

                        query.insert(sql, {
                            bind: {
                                $1: value[0],
                                $2: value[1],
                                $3: value[2],
                                $4: value[3]
                            }
                        })
                    }
                })

                let qtyReceive = detailData.ptsfrd_qty_receive
                let location_git = req.body.loc_git
                let location_to_id = req.body.loc_to_id
                let pt_id = detailData.ptsfrd_pt_id
                let is_booked = req.body.is_booked

                await this.updateQtyInventory(pt_id, location_git, location_to_id, qtyReceive, is_booked)
            }

            transaction.commit()

            res.status(200)
                .json({
                    status: 'success',
                    data: true,
                    error: null
                })
        } catch (error) {
            transaction.rollback()
            res.status(400)
                .json({
                    status: 'failed',
                    data: null,
                    error: error.message
                })
        }
    }

    getDataInventoryExapro = (req, res) => {
        let numberPage = (req.query.page) ? req.query.page : 1
        let {limit, offset} = page(numberPage, 30)

        PtsfrdDet.findAll({
            attributes: [
                [Sequelize.col('detail_product.pt_code'), 'pt_code'],
                [Sequelize.col('detail_product.pt_desc1'), 'pt_name'],
                [Sequelize.fn('SUM', Sequelize.col('ptsfrd_qty_receive')), 'total_qty'],
                [Sequelize.col('detail_product->EnMstr.en_desc'), 'entity']
            ],
            include: [
                {
                    model: PtMstr,
                    required: true,
                    as: 'detail_product',
                    attributes: [],
                    include: [
                        {
                            model: EnMstr,
                            as: 'EnMstr',
                            attributes: []
                        }
                    ]
                }
            ],
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.col('ptsfrd_ptsfr_oid'), {
                        [Op.in]: Sequelize.literal(`(SELECT ptsfr_oid FROM public.ptsfr_mstr WHERE ptsfr_loc_to_id IN (SELECT loc_id FROM public.loc_mstr WHERE loc_ptnr_id = ${req.params.ptnr_id}))`)
                    }),
                    Sequelize.where(Sequelize.col('detail_product.pt_en_id'), {
                        [Op.in]: (req.query.entity) ? [req.query.entity] : [1, 2, 3]
                    }),
                    Sequelize.where(Sequelize.col('detail_product.pt_desc1'), {
                        [Op.iLike]: (req.query.search) ? `%${req.query.search}%` : `%%`
                    })
                ]
            },
            limit: limit,
            offset: offset,
            group: [
                'pt_code',
                'pt_name',
                'entity'
            ]
        })
        .then(result => {
            res.status(200)
                .json({
                    status: 'success',
                    data: result,
                    error: null
                })
        })
        .catch(err => {
            res.status(400)
                .json({
                    status: 'failed',
                    data: null,
                    error: err.message
                })
        })
    }

    updateQtyInventory = async (pt_id, loc_git, loc_to_id, qty, is_booked) => {
        let dataGIT = await this.getQtyProduct(pt_id, loc_git)

        if (dataGIT != null) {
            let qtyData

            if (is_booked == 'Y') {
                qtyData = (dataGIT['invc_qty_booked'] != null) ? dataGIT['invc_qty_booked'] - qty : qty
            } else {
                qtyData = (dataGIT['invc_qty_available'] != null) ? dataGIT['invc_qty_available'] - qty : qty
            }

            await this.updateQtyProduct(pt_id, loc_git, qtyData, is_booked)
        }

        let dataMS = await this.getQtyProduct(pt_id, loc_to_id)

        if (dataMS != null) {
            let qtyData

            if (is_booked == 'Y') {
                qtyData = (dataMS['invc_qty_booked'] != null ) ? dataMS['invc_qty_booked'] + qty : qty
            } else {
                qtyData = (dataMS['invc_qty_available'] != null) ? dataMS['invc_qty_available'] + qty : qty
            }

            await this.updateQtyProduct(pt_id, loc_to_id, qtyData, is_booked)
        }
    }

    getQtyProduct = async (pt_id, loc_id) => {
        let data = await InvcMstr.findOne({
            attributes: ['invc_qty_booked', 'invc_qty_available'],
            where: {
                invc_pt_id: pt_id,
                invc_loc_id: loc_id
            }
        })

        return data
    }

    updateQtyProduct = async (pt_id, loc_id, qty, is_booked) => {
        if (is_booked == 'Y') {
            await InvcMstr.update({
                invc_qty_booked: qty
            }, {
                where: {
                    invc_pt_id: pt_id,
                    invc_loc_id: loc_id
                },
                logging: async (sql, queryObject) => {
                    let value = queryObject

                    await query.insert(sql, {
                        bind: {
                            $1: value[0],
                            $2: value[1],
                            $3: value[2]
                        }
                    })
                }
            })
        } else {
            await InvcMstr.update({
                invc_qty_available: qty
            }, {
                where: {
                    invc_pt_id: pt_id,
                    invc_loc_id: loc_id
                },
                logging: async (sql, queryObject) => {
                    let value = queryObject

                    await query.insert(sql, {
                        bind: {
                            $1: value[0],
                            $2: value[1],
                            $3: value[2]
                        }
                    })
                }
            })
        }
    }
}

module.exports = new InventoryController()