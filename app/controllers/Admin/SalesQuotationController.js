const {Sequelize, Op} = require('sequelize')
const {PtnrMstr, VisitMstr, VisitedDet, CodeMstr, PtnrgGrp, TConfUser, PsPeriodeMstr, EnMstr, SoMstr, PlansMstr, PtnraAddr} = require('../../../models')
const helper = require('../../../helper/helper')
const moment = require('moment')
const {v4: uuidv4} = require('uuid')

const SalesQuotationController = {}

SalesQuotationController.index = async (req, res) => {
    try {
        let pageNumber = (req.query.page) ? req.query.page : 1
        let {limit, offset, page} = helper.page(pageNumber, 10)

        let dateLastCheckIn = (req.query.total_day) ?
                                moment().subtract(req.query.total_day, 'days').format('YYYY-MM-DD') : 
                                moment().format('YYYY-MM-DD')

        let where = {
            [Op.and]: [
                Sequelize.where(Sequelize.col('user_ptnr_id'), {
                    [Op.in]: Sequelize.literal("(SELECT ptnr_id FROM public.ptnr_mstr WHERE ptnr_is_emp = 'Y')")
                }),
                Sequelize.where(Sequelize.col('userid'), {
                    [Op.in]: Sequelize.literal(`(select visit_sales_id from public.visit_mstr where visit_code in (select visited_visit_code from public.visited_det where to_char(visited_check_in, 'YYYY-MM-DD') = '${dateLastCheckIn}'))`)
                })
            ]
        }

        if (req.query.search != null) {where.usernama = {[Op.like]: `%${req.query.search}%`}}

        let {count, rows} = await TConfUser.findAndCountAll({
            attributes: [
                ['userid', 'ptnr_id'],
                ['usernama', 'ptnr_name'],
                ['nik_id', 'ptnr_nik_id']
            ],
            where: where,
            limit: limit,
            offset: offset
        })

        for (const partner of rows) {
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
                output: (salesLastCheckIn != null && ('output' in salesLastCheckIn) && salesLastCheckIn.output != null) ? salesLastCheckIn.output.dataValues.output : null
            }
        }

        res.status(200)
            .json({
                code: 200,
                status: 'success',
                data: {
                    sales: rows,
                    current_page: page,
                    total_page: Math.ceil(count/limit)
                },
                errors: null
            })
    } catch (error) {
        res.status(400)
            .json({
                code: 400,
                status: error.message,
                data: null,
                errors: error.stack
            })
    }
}

SalesQuotationController.visitation = async (req, res) => {
    try {
        let sales = await TConfUser.findOne({
            attributes: ['nik_id', 'usernama', ['userid', 'user_ptnr_id']],
            where: {
                userid: req.params.ptnr_id
            },
            include: [
                {
                    model: EnMstr,
                    as: 'entity',
                    attributes: ['en_desc']
                }
            ]
        })

        let data = await Promise.all([getTotalCheckin(sales.user_ptnr_id), resultVisitation(sales.user_ptnr_id)])

        sales.dataValues.totalCheckIn = data[0]
        sales.dataValues.outputVisitation = data[1]

        res.status(200)
            .json({
                code: 200,
                status: 'success!',
                data: sales,
                error: null
            })
    } catch (error) {
        res.status(400)
            .json({
                code: 400,
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
                code: 200,
                status: 'success!',
                data: dataVisitation,
                error: null
            })
    } catch (error) {
        res.status(400)
            .json({
                code: 400,
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
                code: 200,
                status: 'success',
                data: detailVisitation,
                error: null
            })
    } catch (error) {
        res.status(400)
            .json({
                code: 400,
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
                code: 200,
                status: 'success!',
                data: periode,
                error: null
            })
    } catch (error) {
        res.status(400)
            .json({
                code: 400,
                status: error.message,
                data: null,
                error: error.stack
            })
    }
}

SalesQuotationController.getSales = async (req, res) => {
    try {
        let page = (req.query.page) ? req.query.page : 1

        let {limit, offset} = helper.page(page, 10)

        let where = {
            user_ptnr_id: {
                [Op.in]: Sequelize.literal(`(SELECT ptnr_id FROM public.ptnr_mstr WHERE ptnr_is_emp = 'Y')`)
            }
        }

        if (req.query.search) {where.usernama = {[Op.like]: `%${req.query.search}%`}}

        let sales = await TConfUser.findAll({
            attributes: ['usernama', ['userid', 'user_ptnr_id']],
            where: where,
            limit: limit,
            offset: offset
        })

        let totalData = await TConfUser.count({
            where: where
        })

        res.status(200)
            .json({
                code: 200,
                status: 'success!',
                data: sales,
                current_page: page,
                total_page: Math.ceil(totalData / limit),
                error: null
            })
    } catch (error) {
        res.status(400)
            .json({
                code: 400,
                status: error.message,
                data: null,
                current_page: page,
                total_page: null,
                error: error.stack
            })
    }
}

SalesQuotationController.getCheckinData = async (req, res) => {
    try {
        let startdate = (req.query.startdate) ? req.query.startdate : moment().format('YYYY-MM-DD')
        let enddate = (req.query.enddate) ? moment(req.query.enddate).format('YYYY-MM-DD') : moment().subtract(3, 'months').format('YYYY-MM-DD')

        let data = await VisitedDet.findAll({
            attributes: [
                [Sequelize.literal(`to_char(visited_check_in, 'YYYY-MM-DD')`), 'date'],
                ['visited_address_gps_check_in', 'checkin_location'],
                ['visited_address_gps_check_out', 'checkout_location'],
            ],
            include: [
                {
                    model: CodeMstr,
                    as: 'objective',
                    attributes: [['code_name', 'name']]
                },{
                    model: CodeMstr,
                    as: 'output',
                    attributes: [['code_name', 'name']]
                },{
                    model: PtnrMstr,
                    as: 'visited_partner',
                    attributes: [['ptnr_name', 'name']]
                }
            ],
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.col('visited_visit_code'), {
                        [Op.in]: Sequelize.literal(`(SELECT visit_code FROM public.visit_mstr WHERE visit_sales_id = ${req.params.user_ptnr_id})`)
                    }),
                    Sequelize.where(Sequelize.literal(`to_char(visited_check_in, 'YYYY-MM-DD')`), {
                        [Op.between]: [enddate, startdate]
                    })
                ]
            },
            order: [['visited_check_in', 'desc']]
        })

        res.status(200)
            .json({
                code: 200,
                status: 'success',
                data: data,
                error: null
            })
    } catch (error) {
        res.status(400)
            .json({
                code: 400,
                status: error.message,
                data: null,
                error: error.stack
            })
    }
}

SalesQuotationController.getDataSOforSQ = async (req, res) => {
    try {
        let {periode_start_date, periode_end_date} = await currentPeriode(req.query.periode_code)

        let data = await SoMstr.findAll({
            attributes: [
                'so_date',
                'so_code',
                ['so_shipping_address', 'location'],
                'so_total'
            ],
            include: [
                {
                    model: CodeMstr,
                    as: 'payment_type',
                    attributes: [['code_name', 'type']]
                },
                {
                    model: PtnrMstr,
                    as: 'customer',
                    attributes: [['ptnr_name', 'customer']]
                }
            ],
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.col('so_sales_person'), {
                        [Op.eq]: Sequelize.literal(`(SELECT user_ptnr_id FROM public.tconfuser WHERE userid = ${req.params.user_ptnr_id})`)
                    }),
                    Sequelize.where(Sequelize.col('so_date'), {
                        [Op.between]: [periode_start_date, periode_end_date]
                    })
                ]
            },
            order: [['so_date', 'desc']]
        })

        res.status(200)
            .json({
                code: 200,
                status: 'success!',
                data: data,
                error: null
            })
    } catch (error) {
        res.status(400)
            .json({
                code: 400,
                status: error.message,
                data: null,
                error: error.stack
            })
    }
}

SalesQuotationController.getDataOutput = async (req, res) => {
    try {
        let {periode_start_date, periode_end_date} = await currentPeriode(req.query.periode_code)

        if (req.params.code_id == 991381) {
            res.status(200)
                .json({
                    code: 200,
                    status: 'success!',
                    data: [],
                    error: null
                })

            return
        }

        let data = await VisitedDet.findAll({
            attributes: [
                [Sequelize.literal('to_char(visited_check_in, \'YYYY-MM-DD\')'), 'date'],
                ['visited_address_gps_check_in', 'address']
            ],
            include: [
                {
                    model: PtnrMstr,
                    as: 'visited_partner',
                    attributes: [['ptnr_name', 'name']]
                },
                {
                    model: CodeMstr,
                    as: 'output',
                    attributes: [['code_name', 'type']]
                }
            ],
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.col('visited_visit_code'), {
                        [Op.in]: Sequelize.literal(`(SELECT visit_code FROM public.visit_mstr WHERE visit_sales_id = ${req.params.user_ptnr_id})`)
                    }),
                    Sequelize.where(Sequelize.literal('to_char(visited_check_in, \'YYYY-MM-DD\')'), {
                        [Op.between]: [periode_start_date, periode_end_date]
                    }),
                    Sequelize.where(Sequelize.col('visited_output'), {
                        [Op.eq]: req.query.code_id
                    })
                ]
                
            },
            order: [['visited_check_in', 'desc']]
        })

        res.status(200)
            .json({
                code: 200,
                status: 'success!',
                data: data,
                error: null
            })
    } catch (error) {
        res.status(400)
            .json({
                code: 400,
                status: error.message,
                data: null,
                error: error.stack
            })
    }
}

SalesQuotationController.getPeriode = async (req, res) => {
    try {
        let periode = await PsPeriodeMstr.findAll({
            attributes: [
                'periode_code',
                [Sequelize.fn('CONCAT', Sequelize.fn('REPLACE', Sequelize.fn('TO_CHAR', Sequelize.col('periode_start_date'), 'DD'), ' ', ''), ' ', Sequelize.fn('REPLACE', Sequelize.fn('TO_CHAR', Sequelize.col('periode_start_date'), 'Month'), ' ', ''), ' ', Sequelize.fn('REPLACE', Sequelize.fn('TO_CHAR', Sequelize.col('periode_start_date'), 'YYYY'), ' ', '')), 'start_periode'],
                [Sequelize.fn('CONCAT', Sequelize.fn('REPLACE', Sequelize.fn('TO_CHAR', Sequelize.col('periode_end_date'), 'DD'), ' ', ''), ' ', Sequelize.fn('REPLACE', Sequelize.fn('TO_CHAR', Sequelize.col('periode_end_date'), 'Month'), ' ', ''), ' ', Sequelize.fn('REPLACE', Sequelize.fn('TO_CHAR', Sequelize.col('periode_end_date'), 'YYYY'), ' ', '')), 'end_periode']
            ]
        })

        res.status(200)
            .json({
                code: 200,
                status: 'success!',
                data: periode,
                error: null
            })
    } catch (error) {
        res.status(400)
            .json({
                code: 400,
                status: error.message,
                data: null,
                error: error.stack
            })
    }
}

SalesQuotationController.getGoal = async (req, res) => {
    try {
        let current_periode = currentPeriode(req.query.periode_code)
        let data_sales = getSales(req.params.userid)

        let required_data = await Promise.all([current_periode, data_sales])

        let dataGoal = SoMstr.sum('so_total', {
            where: {
                so_ref_sq_oid: {
                    [Op.in]: Sequelize.literal(`(SELECT sq_oid FROM public.sq_mstr WHERE sq_sales_person = ${required_data[1].user_ptnr_id} AND sq_date BETWEEN '${required_data[0].periode_start_date}' AND '${required_data[0].periode_end_date}')`)
                },
                so_oid: {
                    [Op.in]: Sequelize.literal(`(SELECT soship_so_oid FROM public.soship_mstr)`)
                }
            }
        })

        let dataTarget = PlansMstr.findOne({
            attributes: [
                ['plans_amount_total', 'total_target']
            ],
            where: {
                plans_sales_id: required_data[1].userid,
                plans_periode: required_data[0].periode_code
            }
        })

        let allData = await Promise.all([dataGoal, dataTarget])

        let data = {
            target: (allData[1] == null) ? 0 : allData[1].dataValues.total_target,
            tercapai: (allData[0] == null) ? 0 : allData[0]
        }

        res.status(200)
            .json({
                code: 200,
                status: 'success!',
                data: data,
                error: null
            })
    } catch (error) {
        res.status(400)
            .json({
                code: 400,
                status: error.message,
                data: null,
                error: error.stack
            })
    }
}

SalesQuotationController.getVisitationCodeSales = (req, res) => {
    VisitMstr.findAll({
        attributes: [
            'visit_code', 
            ['visit_startdate', 'start_date'],
            ['visit_enddate', 'end_date']
        ],
        where: {
            visit_sales_id: req.params.userid
        }
    })
    .then(result => {
        res.status(200)
            .json({
                status: 'success!',
                data: result,
                error: null
            })
    })
    .catch(err => {
        res.status(400)
            .json({
                status: err.message,
                data: null,
                error: err.stack
            })
    })
}

SalesQuotationController.getCustomer = (req, res) => {
    let where = {ptnr_is_emp: 'N'}
    if (req.query.search) {where.ptnr_name = {[Op.like]: `%${req.query.search}%`}}

    PtnrMstr.findAll({
        attributes: ['ptnr_id', 'ptnr_name'],
        where: where,
        include: [
            {
                model: PtnraAddr,
                as: 'address_partner',
                attributes: [
                    [Sequelize.fn('CONCAT', Sequelize.col('ptnra_line_1'), ' ', Sequelize.col('ptnra_line_2'), ' ', Sequelize.col('ptnra_line_3')), 'ptnra_addr'],
                    'ptnra_phone_1', 
                    'ptnra_phone_2'
                ]
            }
        ]
    })
    .then(result => {
        res.status(200)
            .json({
                code: 200,
                status: 'success!',
                data: result,
                error: null
            })
    })
    .catch(err => {
        res.status(200)
            .json({
                code: 400,
                status: err.message,
                data: null,
                error: err.stack
            })
    })
}

SalesQuotationController.addNewCustomerToVisit = async (req, res) => {
    try {
        let user = await helper.auth(req.get('authorization'))
        let data = await VisitedDet.create({
                        visited_oid: uuidv4(),
                        visited_visit_code: req.body.visit_code,
                        visited_type: req.body.type,
                        visited_ptnr_id: req.body.ptnr_id,
                        visited_cus_name: req.body.cus_name,
                        visited_cus_address: req.body.cus_address,
                        visited_cus_phone: req.body.cus_phone,
                        visited_add_by: user.usernama,
                        visited_add_date: moment().format('YYYY-MM-DD HH:mm:ss')
                    })

        res.status(200)
            .json({
                code: 200,
                status: 'success!',
                data: data,
                error: null
            })
    } catch (error) {
        res.status(400)
            .json({
                code: 400,
                status: error.message,
                data: null,
                error: error.stack
            })
    }
}

SalesQuotationController.getTypeVisitation = (req, res) => {
    CodeMstr.findAll({
        attributes: [
            ['code_id', 'id'], 
            ['code_name', 'type']
        ],
        where: {
            code_field: 'visiting'
        }
    })
    .then(result => {
        res.status(200)
            .json({
                code: 200,
                status: 'success!',
                data: result,
                error: null
            })
    })
    .catch(err => {
        res.status(400)
            .json({
                code: 400,
                status: err.message,
                data: null,
                error: err.stack
            })
    })
}

SalesQuotationController.createSchedule = async (req, res) => {
    try {
        // get personal account from users
        let {usernama} = await helper.auth(req.get('authorization'))

        // start check before create planning schedule
        let checkBeforeCreatePlanningSchedule = await Promise.all([checkSchedule(req.body.visit_sales_id, req.body.visit_startdate), getPersonalAccountSales(req.body.visit_sales_id)])

        // getPromiseData
        let {status, key} = checkBeforeCreatePlanningSchedule[0]
        let {en_id} = checkBeforeCreatePlanningSchedule[1]

        if (status == true) {
            res.status(300)
                .json({
                    status: 'gagal',
                    data: {
                        key: key
                    },
                    error: 'tanggal tersebut sudah masuk ke jadwal!'
                })

            return
        }
        // end check before planning schedule

        // generate visit code
        let visit_code = await generateVisitCode(en_id)

        // create planning schedule
        let planningSchedule = await VisitMstr.create({
            visit_code: visit_code,
            visit_startdate: req.body.visit_startdate,
            visit_enddate: req.body.visit_enddate,
            visit_en_id: en_id,
            visit_sales_id: req.body.visit_sales_id,
            visit_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            visit_add_by: usernama,
            visit_status: 'N'
        })

        res.status(200)
            .json({
                status: 'success!',
                data: planningSchedule,
                error: null
            })
    } catch (error) {
        res.status(400)
            .json({
                status: 'failed!',
                data: null,
                error: error.stack
            })
    }
}

let checkSchedule = async (sales_id, start_date) => {
    let visitCode = await VisitMstr.findOne({
        attributes: ['visit_code'],
        where: {
            visit_sales_id: parseInt(sales_id),
            visit_enddate: {
                [Op.gte]: moment(start_date).format('YYYY-MM-DD')
            }
        },
        order: [['visit_enddate', 'desc']]
    })

    return (visitCode) ? {status: true, key: visitCode.visit_code} : {status: false, key: null}
}

let getPersonalAccountSales = async (sales_id) => {
    let result = await TConfUser.findOne({
        attributes: ['userid', 'groupid', 'usernama', 'en_id', 'user_ptnr_id'],
        where: {
            userid: sales_id
        }
    })

    return result
}


let generateVisitCode = async (en_id) => {
    let visitCode = await VisitMstr.findOne({
        order: [['visit_add_date', 'desc']]
    })

    let totalPlannigSchedule = (!visitCode) ? 1 : parseInt(visitCode.visit_code.substring(12)) + 1

    return `VST0${en_id}456${moment().format('MMYY')}${totalPlannigSchedule}`
}

let getTotalCheckin = async (ptnr_id) => {
    try {
        let totalCheckIn = await VisitedDet.count({
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.col('visited_visit_code'), {
                        [Op.eq]: Sequelize.literal(`(SELECT visit_code FROM public.visit_mstr WHERE visit_sales_id = ${ptnr_id} ORDER BY visit_startdate DESC LIMIT 1)`)
                    }),
                    Sequelize.where(Sequelize.col('visited_check_in'), {
                        [Op.not]: null
                    })
                ]
            }
        })

        let totalData = await VisitedDet.count({
            where: {
                visited_visit_code: {
                    [Op.eq]: Sequelize.literal(`(SELECT visit_code FROM public.visit_mstr WHERE visit_sales_id = ${ptnr_id} ORDER BY visit_startdate DESC LIMIT 1)`)
                }
            }
        })
    
        let data = {
            total_check_in: totalCheckIn,
            total_data: totalData
        }

        return data
    } catch (error) {
        return error.message
    }
}

let resultVisitation = async (ptnr_id) => {
    let rawData = await CodeMstr.findAll({
        attributes: [
            'code_name',
            'code_id',
            [Sequelize.fn('COUNT', Sequelize.col('total_output.visited_output')), 'total_data'],
        ],
        where: {
            code_id: {
                [Op.in]: [991382, 991381, 991383, 991384]
            }
        },
        include: [
            {
                model: VisitedDet,
                as: 'total_output',
                attributes: ['visited_output'],
                
                required: false,
                where: {
                    visited_visit_code: {
                        [Op.eq]: Sequelize.literal(`(SELECT visit_code FROM public.visit_mstr WHERE visit_sales_id = ${ptnr_id} ORDER BY visit_startdate DESC limit 1)`)
                    }
                }
            }
        ],
        group: ['CodeMstr.code_name', 'CodeMstr.code_id', 'total_output.visited_output'],
        raw: true
    })

    return rawData
}

let currentPeriode = async (periode) => {
    let periodeSearch = (periode) ? periode : moment().format('YYYYMM')

    let currentPeriode = await PsPeriodeMstr.findOne({
                                attributes: ['periode_code', 'periode_start_date', 'periode_end_date'],
                                where: {
                                    [Op.and]: [
                                        Sequelize.where(Sequelize.col('periode_code'), {
                                            [Op.eq]: periodeSearch
                                        })
                                    ]
                                }
    })

    return currentPeriode
}

let getSales = async userid => {
    let dataSales = await TConfUser.findOne({
        attributes: ['userid', 'user_ptnr_id'],
        where: {
            userid: userid
        }
    })

    return dataSales
}

module.exports = SalesQuotationController