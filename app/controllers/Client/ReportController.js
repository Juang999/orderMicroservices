const {SoMstr, SqMstr, Sequelize, PtnrMstr, ArMstr, ArsoSo, SoShipMstr, SoshipdDet, SodDet, PtMstr} = require('../../../models')
const moment = require('moment')
const {Op} = require('sequelize')
const {auth} = require('../../../helper/helper')

class ExportController {
    getTotalSOSales = (req, res) => {
        PtnrMstr.findAll({
            attributes: [
                ['ptnr_oid', 'sales_oid'],
                ['ptnr_name', 'sales_person'],
                [Sequelize.literal(`sum(sales_quotation.sq_total)`), 'total_sq'],
                [Sequelize.literal(`sum(customer.so_total)`), 'total_so'],
                [Sequelize.literal(`sum(sales_quotation.sq_total) / sum(customer.so_total) * 100`), 'gap']
            ],
            include: [
                {
                    model: SoMstr,
                    required: true,
                    as: 'customer',
                    attributes: [],
                }, {
                    model: SqMstr,
                    required: true,
                    as: 'sales_quotation',
                    attributes: []
                }
            ],
            where: {
                ptnr_is_emp: 'Y'
            },
            group: ['sales_oid', 'sales_person'],
            order: [['total_so', 'desc']]
        })
        .then(result => {
                res.status(200)
                    .json({
                        status: 'berhasil!',
                        data: result,
                        error: null
                    })
        })
        .catch(err => {
            res.status(400)
                .json({
                    status: 'failed!',
                    data: null,
                    error: err.message
                })
        })
    }

    getTotalPersentageOfSales = (req, res) => {
        let startDate = (req.query.start_date) ? moment(req.query.start_date).format('YYYY-MM-DD 00:00:00') : moment().startOf('months').format('YYYY-MM-DD 00:00:00')
        let endDate = (req.query.end_date) ? moment(req.query.end_date).format('YYYY-MM-DD 23:59:59') : moment().endOf('months').format('YYYY-MM-DD 23:59:59')

        PtnrMstr.findAll({
            attributes: [
                'ptnr_id',
                'ptnr_name',
                [
                    Sequelize.fn('COALESCE', Sequelize.fn('ROUND', Sequelize.fn('SUM', Sequelize.col('sales.so_total')), 0), 0), 'total'
                ],
                [
                    Sequelize.fn('COALESCE', Sequelize.fn('ROUND', Sequelize.literal(`(sum(sales.so_total) / (select sum(so_total) from public.so_mstr where so_add_date between '${startDate}' and '${endDate}')) * 100/100`), 2), 0), 'percentage'
                ]
            ],
            include: [
                {
                    model: SoMstr,
                    as: 'sales',
                    attributes: [],
                    required: true,
                }
            ],
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.col('ptnr_is_emp'), {
                        [Op.eq]: 'Y'
                    }),
                    Sequelize.where(Sequelize.col('sales.so_add_date'), {
                        [Op.between]: [startDate, endDate]
                    })
                ]
            },
            group: [
                'ptnr_oid',
                'ptnr_name'
            ],
            order: [
                ['total', 'desc']
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
                    status: 'failed!',
                    data: null,
                    error: err.message
                })
        })
    }

    getHistoryDebt = async (req, res) => {
        try {
            let startDate = (req.query.start_date) ? moment(req.query.start_date).format('YYYY-MM-DD') : moment().startOf('months').format('YYYY-MM-DD')
            let endDate = (req.query.start_date) ? moment(req.query.end_date).format('YYYY-MM-DD') : moment().endOf('months').format('YYYY-MM-DD')
            let status = (req.query.status == 'C') ? 'c' : null

            let authUser = await auth(req.headers['authorization'])

            let historyDebt = await ArMstr.findAll({
                attributes: [
                    'ar_oid',
                    'ar_code',
                    'ar_amount',
                    'ar_pay_amount',
                    'ar_date'
                ],
                where: {
                    ar_bill_to: authUser.user_ptnr_id,
                    ar_date: {
                        [Op.between]: [startDate, endDate]
                    },
                    ar_status: {
                        [Op.eq]: status
                    }
                },
                order: [['ar_date', 'desc']]
            })

            let remainingDebt = await ArMstr.findAll({
                attributes: [
                    [Sequelize.literal('SUM(ar_amount) - SUM(ar_pay_amount)'), 'total_debt']
                ],
                where: {
                    ar_bill_to: authUser.user_ptnr_id,
                    ar_status: {
                        [Op.is]: null
                    },
                    ar_pay_amount: {
                        [Op.lt]: Sequelize.col('ar_amount')
                    },
                    ar_date: {
                        [Op.between]: [startDate, endDate]
                    },
                }
            })

            res.status(200)
                .json({
                    status: 'success',
                    data: {
                        history_debt: historyDebt,
                        total_debt: remainingDebt[0].dataValues.total_debt
                    },
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

    getDetailHistoryDebt = async (req, res) => {
        try {
            let authUser = await auth(req.headers['authorization'])

            let detailHistoryDebt = await ArMstr.findOne({
                attributes: [
                    'ar_oid',
                    'ar_date',
                    'ar_code',
                    'ar_amount',
                ],
                include: [
                    {
                        model: ArsoSo,
                        as: 'data_so',
                        attributes: [
                            'arso_so_oid',
                            'arso_so_code',
                            'arso_so_date'
                        ]
                    }
                ],
                where: {
                    ar_oid: req.params.ar_oid,
                    ar_bill_to: authUser.user_ptnr_id
                }
            })

            res.status(200)
                .json({
                    status: 'success',
                    data: detailHistoryDebt,
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

    getDataShipment = (req, res) => {
        SoShipMstr.findAll({
            attributes: [
                'soship_oid',
                'soship_code',
                'soship_date'
            ],
            include: [
                {
                    model: SoshipdDet,
                    as: 'detail_shipment',
                    attributes: [
                        'soshipd_oid',
                        ],
                    include: [
                        {
                            model: SodDet,
                            as: 'detail_sales_order',
                            attributes: [
                                [Sequelize.literal('"detail_shipment->detail_sales_order->detail_product"."pt_desc1"'), 'product_name'],
                                ['sod_price', 'price'],
                            ],
                            include: [
                                {
                                    model: PtMstr,
                                    as: 'detail_product',
                                    attributes: []
                                }
                            ]
                        }
                    ]
                }
            ],
            where: {
                soship_so_oid: req.params.so_oid
            }
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
}

module.exports = new ExportController()