const {SoMstr, SodDet, SoshipMstr, SoshipdDet, PtsfrMstr, PtsfrdDet, SqMstr, SqdDet, LocMstr, PtnrMstr, PtMstr, Sequelize} = require('../../../models')
const {Op} = require('sequelize')
const moment = require('moment')

class PointofSalesController {
    getProductConsigment = async (req, res) => {
        try {
            let where = {
                [Op.and]: [
                    Sequelize.where(Sequelize.col('ptsfrd_qty_receive'), {
                        [Op.not]: null
                    }),
                    Sequelize.where(Sequelize.col('header_ptsfr->sales_quotation.sq_sales_program'), {
                        [Op.eq]: 'SATSET'
                    }),
                ]
            }

            if (req.query.last_date) {
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

                where[Op.and][2] = Sequelize.where(Sequelize.col('header_ptsfr.ptsfr_dt'), {
                    [Op.between]: [
                            Sequelize.literal(`(SELECT ptsfr_dt FROM public.ptsfr_mstr WHERE ptsfr_loc_to_id = ${req.params.warehouse_id} AND ptsfr_dt > '${moment.unix(req.query.last_date).format('YYYY-MM-DD HH:mm:ss')}' ORDER BY ptsfr_dt ASC LIMIT 1)`),
                            Sequelize.literal(`(SELECT ptsfr_dt FROM public.ptsfr_mstr WHERE ptsfr_loc_to_id = ${req.params.warehouse_id} ORDER BY ptsfr_dt DESC LIMIT 1)`)
                        ]
                })
            }

            let rawDataProduct = await PtsfrdDet.findAll({
                attributes: [
                    ['ptsfrd_pt_id', 'pt_id'],
                    [Sequelize.col('detail_product.pt_desc1'), 'product_name'],
                    ['ptsfrd_qty', 'qty'],
                    ['ptsfrd_qty_receive', 'qty_receive'],
                    [Sequelize.col('header_ptsfr.ptsfr_oid'), 'ptsfr_oid'],
                    [Sequelize.col('header_ptsfr->sales_quotation.sq_oid'), 'sq_oid']
                ],
                include: [
                    {
                        model: PtMstr,
                        as: 'detail_product',
                        attributes: [],
                        required: true,
                        duplicating: false
                    }, {
                        model: PtsfrMstr,
                        as: 'header_ptsfr',
                        attributes: [],
                        required: true,
                        duplicating: false,
                        include: [
                            {
                                model: SqMstr,
                                as: 'sales_quotation',
                                attributes: [],
                                required: true,
                                duplicating: false,
                                nest: true,
                                raw: true,
                            }
                        ]
                    }
                ],
                where: where,
                limit: 20
            })

            for (const dataProduct of rawDataProduct) {
                dataProduct.dataValues.product_price = await this.getDetailProductConsigment(dataProduct.dataValues.sq_oid, dataProduct.dataValues.pt_id)
            }

            res.status(200)
                .json({
                    code: 200,
                    status: 'success',
                    data: rawDataProduct,
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

    getDetailProductConsigment = async (sq_oid, pt_id) => {
        let {sqd_price} = await SqdDet.findOne({
            attributes: ['sqd_price'],
            where: {
                sqd_sq_oid: sq_oid,
                sqd_pt_id: pt_id
            }
        })

        return sqd_price
    }

    checkLastSentProduct = async (warehouse_id, date) => {
        let {ptsfr_dt} = await PtsfrMstr.findOne({
            attributes: ['ptsfr_dt'],
            where: {
                ptsfr_loc_to_id: warehouse_id
            },
            order: [['ptsfr_dt', 'desc']]
        })

        let momentSoshipdDt = moment(ptsfr_dt).format('YYYY-MM-DD HH:mm:ss')
        let momentDate = moment.unix(date).format('YYYY-MM-DD HH:mm:ss')

        return (momentSoshipdDt == momentDate) ? true : false
    }
}

module.exports = new PointofSalesController()