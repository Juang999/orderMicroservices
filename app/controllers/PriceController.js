const {PiMstr} = require("../../models")

const PriceController = {
    getPriceType: (req, res) => {
        PiMstr.findAll({
            where: {
                pi_ptnrg_id: req.params.group_id
            },
            attributes: ['pi_oid', 'pi_desc', 'pi_code']
        }).then(result => {
            res.status(200)
                .json({
                    status: "success",
                    message: "success to price type",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "failed",
                    message: "failed to get price type",
                    error: err.message
                })
        })
    }
}

module.exports = PriceController