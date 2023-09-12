const {SoMstr, SodDet, SoshipMstr, SoshipdDet, PtsfrMstr, PtsfrdDet, LocMstr, PtnrMstr, PtMstr, Sequelize} = require('../../../models')
const {Op} = require('sequelize')
const moment = require('moment')

class PointofSalesController {
    getProductConsigment = async (req, res) => {
        try {
            if (await this.checkLastSentProduct(req.params.warehouse_id, req.query.last_date) == true) {
                res.status(300)
                    .json({
                        code: 300,
                        status: 'data telah terkirim',
                        data: null,
                        error: null
                    })

                return
            }


            let dataProductConsigment = await SoshipdDet.findAll({
                attributes: [
                    [Sequelize.col('warehouse_shippment.loc_id'), 'warehouse_id'],
                    [Sequelize.col('warehouse_shippment.loc_desc'), 'warehouse_name'],
                    [Sequelize.col('warehouse_shippment->warehouse_owner.ptnr_name'), 'owner_name'],
                    [Sequelize.col('detail_sales_order->detail_product.pt_desc1'), 'product_name'],
                    [Sequelize.col('detail_sales_order->detail_product.pt_id'), 'product_id'],
                    [Sequelize.col('detail_sales_order->detail_product.pt_code'), 'product_partnumber'],
                    [Sequelize.col('detail_sales_order.sod_qty'), 'qty'],
                    [Sequelize.col('detail_sales_order.sod_qty_shipment'), 'qty_shipment'],
                    [Sequelize.fn('TO_CHAR', Sequelize.col('soshipd_dt'), 'YYYY-MM-DD HH24:mi:ss'), 'shippment_date']
                ],
                include: [
                    {
                        model: SodDet,
                        as: 'detail_sales_order',
                        attributes: [],
                        include: [
                            {
                                model: PtMstr,
                                as: 'detail_product',
                                attributes: []
                            }
                        ]
                    },
                    {
                        model: LocMstr,
                        as: 'warehouse_shippment',
                        attributes: [],
                        include: [
                            {
                                model: PtnrMstr,
                                as: 'warehouse_owner',
                                attributes: []
                            }
                        ]
                    }
                ],
                where: {
                    soshipd_loc_id: req.params.warehouse_id,
                    soshipd_dt: {
                        [Op.between]: [
                            Sequelize.literal(`(SELECT soshipd_dt FROM public.soshipd_det WHERE soshipd_loc_id = ${req.params.warehouse_id} AND soshipd_dt > '${moment.unix(req.query.last_date).format('YYYY-MM-DD HH:mm:ss')}' ORDER BY soshipd_dt ASC LIMIT 1)`),
                            Sequelize.literal(`(SELECT soshipd_dt FROM public.soshipd_det WHERE soshipd_loc_id = ${req.params.warehouse_id} ORDER BY soshipd_dt DESC LIMIT 1)`)
                        ]
                    }
                },
                order: [['shippment_date', 'asc']]
            })

            res.status(200)
                .json({
                    code: 200,
                    status: 'success',
                    data: dataProductConsigment,
                    error: null
                })
        } catch (error) {
            res.status(400)
                .json({
                    code: 400,
                    status: 'falled',
                    data: null,
                    error: error.message
                })
        }
    }

    checkLastSentProduct = async (warehouse_id, date) => {
        let {soshipd_dt} = await SoshipdDet.findOne({
            attributes: ['soshipd_dt'],
            where: {
                soshipd_loc_id: warehouse_id
            },
            limit: 1,
            order: [['soshipd_dt', 'desc']]
        })

        let momentSoshipdDt = moment(soshipd_dt).format('YYYY-MM-DD HH:mm:ss')
        let momentDate = moment.unix(date).format('YYYY-MM-DD HH:mm:ss')

        return (momentSoshipdDt == momentDate) ? true : false
    }
}

module.exports = new PointofSalesController()