const {PlansMstr, PlansdDet, PlansptdDet, PtnrMstr, PtnraAddr, sequelize} = require('.././../models')
const helper = require('../../helper/helper')
const {Sequelize, Op} = require('sequelize')
const moment = require('moment')
const {v4: uuidv4} = require('uuid')

const PlanController = {
    getPlan: async (req, res) => {
        try {
            let user = await helper.auth(req.get("authorization"))

            let startDate = (req.query.start_date) ? moment(req.query.start_date) : moment().locale('id').startOf('month').format('2022-MM-DD')
            let endDate = (req.query.end_date) ? moment(req.query.end_date) : moment().locale('id').endOf('month').format('2022-MM-DD')

            let string = `(SELECT plans_oid FROM public.plans_mstr 
                            WHERE plans_sales_id = ${user.user_ptnr_id} 
                            AND plans_periode = (SELECT periode_code FROM public.psperiode_mstr
                            WHERE periode_start_date = '${startDate}' 
                            AND periode_end_date = '${endDate}'))`

            let planDetail = await PlansdDet.findAll({
                where: {
                    plansd_plans_oid: {
                        [Op.eq]: Sequelize.literal(string)
                    }
                },
                include: [
                    {
                        model: PtnrMstr,
                        as: 'PlansCustomer',
                        attributes: ['ptnr_id', 'ptnr_code', 'ptnr_name'],
                        include: [
                            {
                                model: PtnraAddr,
                                as: 'address_partner',
                                attributes: ["ptnra_line_1", "ptnra_line_2", "ptnra_line_3"]
                            }
                        ]
                    }
                ]
            })

            res.status(200)
                .json({
                    status: "success",
                    message: "berhasil mengambil data",
                    data: planDetail
                })
        } catch (error) {
            res.status(400)
                .json({
                    status: "failed",
                    message: "gagal mengambil data",
                    error: error.message
                })
        }
    },
    createUnplan: async (req, res) => {
        try {
            let user = await helper.auth(req.get("authorization"))
            console.log(req.body)

            let getPlanMaster = await PlansMstr.findOne({
                where: {
                    plans_sales_id: user.user_ptnr_id,
                    plans_periode: req.body.periode_code
                },
                attributes: ['plans_oid']
            })

            let rawSeq = await PlansdDet.findOne({
                where: {
                    plansd_plans_oid: getPlanMaster.plans_oid
                },
                order: [['plansd_seq', 'DESC']],
                attributes: ['plansd_seq']
            })

            let seq = (rawSeq) ? rawSeq.plansd_seq + 1 : 1;

            let data = await PlansdDet.create({
                plansd_oid: uuidv4(),
                plansd_plans_oid: getPlanMaster.plans_oid,
                plansd_ptnr_id: req.body.ptnr_id,
                plansd_amount: req.body.amount,
                plansd_seq: seq
            })

            res.status(200)
                .json({
                    status: "success",
                    message: "berhasil membuat data",
                    data: data
                })
        } catch (error) {
            console.log(error)
            res.status(400)
                .json({
                    status: "failed",
                    message: "gagal membuat data",
                    error: error.message
                })
        }
    }
}

module.exports = PlanController