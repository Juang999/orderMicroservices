const {PtnrgGrp} = require('../../models')

const MasterController = {
    getGroup: (req, res) => {
        PtnrgGrp.findAll({
            attributes: ['ptnrg_id', 'ptnrg_name']
        }).then(result => {
            res.status(200)
                .json({
                    status: "success",
                    message: "success to get data group",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "failed",
                    message: "failed to get data group",
                    error: err.message
                })
        })
    }
}

module.exports = MasterController