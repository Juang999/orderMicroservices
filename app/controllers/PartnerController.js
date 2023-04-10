const {Sequelize, Op} = require('sequelize')
const {PtMstr, TConfUser} = require('../../models')

const PartnerController = {
    getPartner: (req, res) => {
        TConfUser.findAll({
            where: {
                user_ptnr_id: {
                    [Op.not]: null,
                    [Op.in]: Sequelize.literal(`(SELECT ptnr_id FROM public.ptnr_mstr WHERE ptnr_is_emp = 'Y')`)
                }
            },
            attributes: ["userid", "usernama", "user_ptnr_id"]
        }).then(result => {
            res.status(200)
                .json({
                    status: "success",
                    message: "berhasil mengambil data",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "failed",
                    message: "gagal mengambil data",
                    error: err.message
                })
        })
    }
}

module.exports = PartnerController