const {Sequelize, Op} = require('sequelize')
const {PtnrMstr, VisitMstr, VisitedDet, LastCheckIn, CodeMstr, PtnrgGrp, TConfUser, PsPeriodeMstr} = require('../../../models')
const helper = require('../../../helper/helper')
const moment = require('moment')

const SalesQuotationController = {}

SalesQuotationController.index = async (req, res) => {
    try {
        let pageNumber = (req.query.page) ? req.query.page : 1
        let {limit, offset} = helper.page(pageNumber, 10)

        let dateLastCheckIn = (req.query.total_day) ?
                                moment().subtract(req.query.total_day, 'days').format('YYYY-MM-DD') : 
                                moment().format('YYYY-MM-DD')

        let where = {
            [Op.and]: [
                Sequelize.where(Sequelize.col('user_ptnr_id'), {
                    [Op.in]: Sequelize.literal("(SELECT ptnr_id FROM public.ptnr_mstr WHERE ptnr_is_emp = 'Y')")
                }),
                Sequelize.where(Sequelize.col('user_ptnr_id'), {
                    [Op.in]: Sequelize.literal(`(select visit_sales_id from public.visit_mstr where visit_code in (select visited_visit_code from public.visited_det where to_char(visited_check_in, 'YYYY-MM-DD') = '${dateLastCheckIn}'))`)
                })
            ]
        }

        if (req.query.search != null) {where.usernama = {[Op.like]: `%${req.query.search}%`}}

        let partners = await TConfUser.findAll({
            attributes: [
                ['user_ptnr_id', 'ptnr_id'],
                ['usernama', 'ptnr_name'],
                ['nik_id', 'ptnr_nik_id']
            ],
            where: where,
            limit: limit,
            offset: offset
        })

        for (const partner of partners) {
            let salesLastCheckIn = await VisitedDet.findOne({
                attributes: [
                    'visited_check_in',
                    'visited_lat_gps_check_in',
                    'visited_long_gps_check_in',
                    'visited_check_out',
                    'visited_lat_gps_check_out',
                    'visited_long_gps_check_out',
                ],
                where: {
                    [Op.and]: [
                        Sequelize.where(Sequelize.literal('to_char(visited_check_in, \'YYYY-MM-DD\')'), {
                            [Op.eq]: dateLastCheckIn
                        }),
                        {visited_visit_code: {
                            [Op.in]: Sequelize.literal(`(SELECT visit_code FROM public.visit_mstr WHERE visit_sales_id = ${partner.dataValues.ptnr_id})`)
                        }}
                    ]
                },
                include: [
                    {
                        model: CodeMstr,
                        as: 'objective',
                        attributes: [
                            ['code_field', 'field'], 
                            ['code_name', 'objective']
                        ]
                    }, {
                        model: CodeMstr,
                        as: 'output',
                        attributes: [
                            ['code_field', 'field'], 
                            ['code_name', 'output']
                        ]
                    }
                ],
                order: [['visited_check_in', 'desc']]
            })

            partner.dataValues.last_check_in = (salesLastCheckIn != null && ('visited_check_in' in salesLastCheckIn)) ? {
                lat: salesLastCheckIn.dataValues.visited_lat_gps_check_in,
                long: salesLastCheckIn.dataValues.visited_long_gps_check_in,
                check_in_date: salesLastCheckIn.dataValues.visited_check_in
            } : null

            partner.dataValues.last_check_out = (salesLastCheckIn != null && ('visited_check_out' in salesLastCheckIn)) ? {
                lat: salesLastCheckIn.dataValues.visited_lat_gps_check_out,
                long: salesLastCheckIn.dataValues.visited_long_gps_check_out,
                check_out_date: salesLastCheckIn.dataValues.visited_check_out
            } : null

            partner.dataValues.last_activity = {
                objective: (salesLastCheckIn != null && ('objective' in salesLastCheckIn) && salesLastCheckIn.objective != null) ? salesLastCheckIn.objective.dataValues.objective : null,
                output: (salesLastCheckIn != null && ('output' in salesLastCheckIn) && salesLastCheckIn.output != null) ? salesLastCheckIn.output.output : null
            }
        }

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
        let sales = await TConfUser.findOne({
            where: {
                user_ptnr_id: req.params.ptnr_id
            },
            attributes: ['ptnr_nik_id']
        })

        let activity = await VisitedDet.findAll({
            where: {
                visited_visit_code: {
                    [Op.in]: Sequelize.literal(`(SELECT visit_code FROM public.visit_mstr WHERE visit_sales_id = ${req.params.ptnr_id})`)
                }
            },
            attribues: ['']
        })

        res.status(200)
            .json({
                status: 'success!',
                data: sales,
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
            attributes: [
                "visited_oid", 
                "visited_visit_code", 
                "visited_type", 
                "visited_ptnr_id", 
                "visited_cus_name", 
                "visited_cus_address",
                "visited_cus_phone", 
                "visited_lat_gps_check_in", 
                "visited_long_gps_check_in", 
                "visited_address_gps_check_in", 
                "visited_result", 
                "visited_status", 
                "visited_date", 
                "visited_foto", 
                "visited_check_in", 
                "visited_check_out", 
                "visited_lat_gps_check_out", 
                "visited_long_gps_check_out", 
                "visited_address_gps_check_out"
            ],
            include: [
                {
                    model: PtnrMstr,
                    as: 'visited_partner',
                    attributes: ['ptnr_id', 'ptnr_name'],
                    include: [
                        {
                            model: PtnrgGrp,
                            as: 'ptnr_group',
                            attributes: ['ptnrg_id', 'ptnrg_name']
                        }
                    ]
                }, {
                    model: CodeMstr,
                    as: 'objective',
                    attributes: ['code_name']
                }, {
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

SalesQuotationController.createPeriode = async (req, res) => {
    try {
        let authUser = await helper.auth(req.get('authorization'))

        let periodeStartDate = moment(req.body.periode_start_date).format('YYYYMM')
        let periodeEndDate = moment(req.body.periode_end_date).format('YYYYMM')

        let periodeCode = periodeStartDate + periodeEndDate

        let beforeSequence = await PsPeriodeMstr.findOne({
            attribues: ['periode_id'],
            order: [['periode_id', 'desc']]
        })

        let sequence = (beforeSequence.periode_id) ? beforeSequence.periode_id + 1 : 1

        let created_at = moment().format('YYYY-MM-DD HH:mm:ss')

        let periode = await PsPeriodeMstr.create({
            periode_oid: req.body.periode_oid,
            periode_code: periodeCode,
            periode_start_date: moment(req.body.periode_start_date).format('YYYY-MM-DD'),
            periode_end_date: moment(req.body.periode_end_date).format('YYYY-MM-DD'),
            periode_active: 'Y',
            periode_add_by: authUser.usernama,
            periode_add_date: created_at,
            periode_id: sequence
        })

        res.status(200)
            .json({
                status: 'success!',
                data: periode,
                error: null
            })
    } catch (error) {
        console.log(error.message)
        res.status(400)
            .json({
                status: error.message,
                data: null,
                error: error.stack
            })
    }
}

module.exports = SalesQuotationController