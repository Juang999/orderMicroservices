const {Sequelize, Op} = require('sequelize')
const {PtnrMstr, VisitMstr, VisitedDet, LastCheckIn} = require('../../../models')
const {Admin} = require('../../../routes/route')
const helper = require('../../../helper/helper')

const SalesQuotationController = {}

SalesQuotationController.index = async (req, res) => {
    try {
        let pageNumber = (req.query.page) ? req.query.page : 1
        let {limit, offset} = helper.page(pageNumber, 10)

        let where = {
            ptnr_is_emp: 'Y',
        }

        if (req.query.search != null) {where.ptnr_name = {[Op.like]: `%${req.query.search}%`}}

        let partners = await PtnrMstr.findAll({
            attributes: ['ptnr_oid', 'ptnr_id', 'ptnr_name'],
            where: where,
            include: [
                {
                    model: LastCheckIn,
                    as: 'last_check_in',
                    attributes: [['check_check_in_latitude', 'lat'], ['check_check_in_longitude', 'lng'], ['check_check_in_date', 'check_in_date']]
                }
            ],
            limit: limit,
            offset: offset
        })

        res.status(200)
            .json({
                status: 'success',
                data: partners,
                errors: null
            })
    } catch (error) {
        res.status(400)
            .json({
                status: error.message,
                data: null,
                errors: error.stack
            })
    }
}

SalesQuotationController.visitation = async (req, res) => {
    try {
        let visit = await VisitMstr.findAll({
            where: {
                visit_sales_id: req.params.ptnr_id
            }
        })

        res.status(200)
            .json({
                status: 'success!',
                data: visit,
                error: null
            })
    } catch (error) {
        res.status(400)
            .json({
                status: error.message,
                data: null,
                error: error.stack
            })
    }
}

SalesQuotationController.visitation_schedule = async (req, res) => {
    VisitMstr.findOne({
        attributes: [
            'visit_code',
            [Sequelize.literal('to_char(visit_startdate, \'Day Month yyyy\')'), 'visit_start_date'],
            [Sequelize.literal('to_char(visit_enddate, \'Day Month yyyy\')'), 'visit_enddate'],
        ],
        where: {
            visit_code: req.params.visit_code
        },
        include: [
            {
                model: VisitedDet,
                as: 'visit_detail',
                attributes: ['visited_oid', 'visited_check_in']
            }
        ]
    })
}

module.exports = SalesQuotationController