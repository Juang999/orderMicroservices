require('dotenv').config()

const {TConfUser, TConfGroup} = require('../models')
const jwt = require('jsonwebtoken')
const {Op} = require("sequelize")
const cryptr = require('cryptr')
const crypter = new cryptr('thisIsSecretPassword')


const auth = async (token) => {
    let splittedToken = token && token.split(" ")[1]

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
                    model: TConfGroup,
                    as: "group",
                    attributes: ["groupnama"]
                }
            ]
        })

        return decryptedUser
    })

    return dataProfile
}

module.exports = auth