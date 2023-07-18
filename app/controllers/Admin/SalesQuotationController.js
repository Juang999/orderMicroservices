const {Sequelize, Op} = require('sequelize')
const {PtnrMstr, VisitMstr, VisitedDet, LastCheckIn, CodeMstr} = require('../../../models')
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
            },
            attributes: ['visit_code', 'visit_startdate', 'visit_enddate', 'visit_status']
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
    try {
        let page = (req.query.page) ? req.query.page : 1
        
        let {limit, offset} = helper.page(page, 10)

        let dataVisitation = await VisitMstr.findOne({
            attributes: [
                'visit_code',
                [Sequelize.literal('concat(replace(to_char(visit_startdate, \'dd\'), \' \', \'\'), \', \',replace(to_char(visit_startdate, \'Day\'), \' \', \'\'), \' \',replace(to_char(visit_startdate, \'Month\'), \' \', \'\'), \' \', replace(to_char(visit_startdate, \'yyyy\'), \' \', \'\'))'), 'visit_start_date'],
                [Sequelize.literal('concat(replace(to_char(visit_enddate, \'dd\'), \' \', \'\'), \', \',replace(to_char(visit_enddate, \'Day\'), \' \', \'\'), \' \', replace(to_char(visit_enddate, \'Month\'), \' \', \'\'), \' \', replace(to_char(visit_startdate, \'yyyy\'), \' \', \'\'))'), 'visit_end_date'],
            ],
            where: {
                visit_code: req.params.visit_code
            },
            include: [
                {
                    model: VisitedDet,
                    as: 'visit_detail',
                    attributes: ['visited_oid', 'visited_check_in', 'visited_check_out'],
                    order: [['visited_check_in', 'desc']],
                    limit: limit,
                    offset: offset,
                }
            ]
        })

        res.status(200)
            .json({
                status: 'success!',
                data: dataVisitation,
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

SalesQuotationController.detailInvitation = async (req, res) => {
    try {
        let detailVisitation = await VisitedDet.findOne({
            where: {
                visited_oid: req.params.visited_oid
            },
            include: [
                {
                    model: CodeMstr,
                    as: 'objective',
                    attributes: ['code_name']
                },{
                    model: CodeMstr,
                    as: 'output',
                    attributes: ['code_name']
                }
            ]
        })

        res.status(200)
            .json({
                status: 'success',
                data: detailVisitation,
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

module.exports = SalesQuotationController