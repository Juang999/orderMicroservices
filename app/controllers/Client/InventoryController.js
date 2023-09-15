const {PtMstr, SqMstr, SqdDet, PtsfrMstr, PtsfrdDet, PtnrMstr, LocMstr, EnMstr, Sequelize, sequelize} = require('../../../models')
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
                    [Sequelize.fn('TO_CHAR', Sequelize.col('ptsfr_dt'), 'YYYY-MM-DD HH:mi:ss'), 'date'],
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
                    ptsfr_loc_to_id: {
                        [Op.in]: Sequelize.literal(`(SELECT loc_id FROM public.loc_mstr WHERE loc_ptnr_id IN (SELECT ptnr_id FROM public.ptnr_mstr WHERE ptnr_parent = ${authUser.user_ptnr_id}))`)
                    },
                    ptsfr_receive_date: {
                        [Op.is]: (req.query.is_complete == 'Y') ? Sequelize.literal('NOT NULL') : Sequelize.literal('NULL')
                    },
                    ptsfr_sq_oid: {
                        [Op.is]: Sequelize.literal('NOT NULL')
                    }
                },
                limit: limit,
                offset: offset,
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
                [Sequelize.col('sales_quotation->sold_to.ptnr_name'), 'receiver_name'],
                [Sequelize.fn('TO_CHAR', Sequelize.col('ptsfr_date'), 'YYYY-MM-DD'), 'ptsfr_dt'],
                [Sequelize.literal(`(SELECT SUM(ptsfrd_qty) FROM public.ptsfrd_det WHERE ptsfrd_ptsfr_oid = '${req.params.ptsfr_oid}')`), 'qty_product'],
                [Sequelize.fn('SUM', Sequelize.col('sales_quotation->detail_sales_quotation.sqd_price')), 'price'],
                [Sequelize.literal(`CASE WHEN ptsfr_receive_date IS NULL THEN 'uncheck' ELSE 'checked' END`), 'status']
            ],
            include: [
                {
                    model: PtsfrdDet,
                    as: 'detail_consigment_items',
                    required: true,
                    duplicating: false,
                    attributes: [
                        'ptsfrd_oid',
                        [Sequelize.literal('"detail_consigment_items->detail_product"."pt_desc1"'), 'product_name'],
                        'ptsfrd_qty',
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
                        }, {
                            model: PtnrMstr,
                            as: 'sold_to',
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
            ]
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
                            $4: value[3]
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
}

module.exports = new InventoryController()