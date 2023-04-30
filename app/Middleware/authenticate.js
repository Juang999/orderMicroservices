require('dotenv').config({path: '/root/microservice_dev/orderMicroservice/.env'})

const jwt = require('jsonwebtoken')
const {TConfUser} = require('../../models')
const cryptr = require('cryptr')
const crypter = new cryptr('thisIsSecretPassword')

let testMiddleware = async (req, res, next) => {    
    let authHeader = req.headers["authorization"]
    let token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        res.status(400)
            .json({
                message: "unauthorize"
            })

        return
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            console.log(err)
            res.status(400)
                .json({
                    status: "failed",
                    message: "failed login"
                })

                return
        }

        let authUser = await TConfUser.findOne({
            where: {
                usernama: user.name
            },
            attributes: ['usernama', 'password']
        })

        if (!authUser) {
            res.status(403)
                .json({
                    message: "unauthorize"
                })

            return
        }

        let verifyPassword = await crypter.decrypt(user.security_word)
        if (verifyPassword != authUser.password) {
            res.status(403)
                .json({
                    result: false
                })
        
                return
        }

        next()
    })

}

module.exports = testMiddleware