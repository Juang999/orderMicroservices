require('dotenv').config()

const {TConfUser, TConfGroup, PtnrMstr, EnMstr} = require('../models')
const jwt = require('jsonwebtoken')
const {Op} = require("sequelize")
const cryptr = require('cryptr')
const crypter = new cryptr('thisIsSecretPassword')


const auth = async (token) => {
    let splittedToken = token && token.split(" ")[1]

    if (!splittedToken) {
        return
    }

    let dataProfile = await jwt.verify(splittedToken, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            return
        }

        let decryptedUser = await TConfUser.findOne({
            where: {
                [Op.and]: [
                    {usernama: user.name},
                    {password: await crypter.decrypt(user.security_word)}
                ]
            },
            include: [
                {
                    model: EnMstr,
                    as: 'entity',
                    attributes: ['en_desc']
                },{
                    model: TConfGroup,
                    as: "group",
                    attributes: ["groupnama"]
                },{
                    model: PtnrMstr,
                    as: 'detail_user',
                    attributes: ['ptnr_id', 'ptnr_dom_id', 'ptnr_en_id', 'ptnr_code', 'ptnr_name', 'ptnr_ptnrg_id']
                }
            ],
            raw: true,
            nest: true
        })

        return decryptedUser
    })

    return dataProfile
}

module.exports = auth