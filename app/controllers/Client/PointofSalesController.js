const {SoMstr, SodDet, SoshipMstr, SoshipdDet, PartnerLoc, PtsfrMstr, PtsfrdDet, SqMstr, SqdDet, LocMstr, PtnrMstr, PtMstr, Sequelize} = require('../../../models')
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
                        [Op.eq]: req.query.sales_program
                    }),
                    Sequelize.where(Sequelize.col('header_ptsfr.ptsfr_loc_to_id'), {
                        [Op.in]: Sequelize.literal(`(SELECT loc_id FROM public.loc_mstr WHERE loc_parent_id = ${req.params.warehouse_id})`)
                    })
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
                    [Sequelize.col('header_ptsfr->detail_location_purpose->parent_location.loc_id'), 'location_id'],
                    [Sequelize.col('header_ptsfr->detail_location_purpose->parent_location.loc_desc'), 'location_name'],
                    [Sequelize.col('detail_product.pt_code'), 'product_partnumber'],
                    [Sequelize.col('detail_product.pt_desc1'), 'product_name'],
                    ['ptsfrd_qty_receive', 'qty_shippment'],
                    ['ptsfrd_dt', 'shippment_date'],
                    ['ptsfrd_pt_id', 'pt_id'],
                    ['ptsfrd_qty', 'qty'],
                    [Sequelize.col('header_ptsfr->sales_quotation.sq_oid'), 'sq_oid'],
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
                            }, {
                                model: LocMstr,
                                as: 'detail_location_purpose'   ,
                                attributes: [],
                                required: true,
                                duplicating: false,
                                include: [
                                    {
                                        model: PartnerLoc,
                                        as: 'parent_location',
                                        required: false,
                                        duplicating: false,
                                        attributes: []
                                    }
                                ]
                            }
                        ]
                    }
                ],
                where: where,
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
        let {ptsfr_receive_date} = await PtsfrMstr.findOne({
            attributes: ['ptsfr_receive_date'],
            where: {
                ptsfr_loc_to_id: warehouse_id
            },
            order: [['ptsfr_dt', 'desc']]
        })

        let momentSoshipdDt = moment(ptsfr_receive_date).format('YYYY-MM-DD HH:mm:ss')
        let momentDate = moment.unix(date).format('YYYY-MM-DD HH:mm:ss')

        return (momentSoshipdDt == momentDate) ? true : false
    }

    getProductOrderOnline = async (req, res) => {
        try {
            
        } catch (error) {
            
        }
    }
}

module.exports = new PointofSalesController()