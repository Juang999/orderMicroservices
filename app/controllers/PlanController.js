const {PlansMstr, PlansdDet, PlansptdDet, PtnrMstr} = require('.././../models')
const helper = require('../../helper/helper')
const {Sequelize, Op} = require('sequelize')

const PlanController = {
    getPlan: async (req, res) => {
        try {
            let user = await helper.auth(req.get("authorization"))

            let planDetail = await PlansdDet.findAll({
                where: {
                    plansd_plans_oid: {
                        [Op.eq]: Sequelize.literal(`(SELECT plans_oid FROM public.plans_mstr WHERE plans_sales_id = ${user.user_ptnr_id})`)
                    }
                },
                include: [
                    {
                        model: PtnrMstr,
                        as: 'PlansCustomer',
                        attributes: ['ptnr_id', 'ptnr_code', 'ptnr_name']
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
    }
}

module.exports = PlanController