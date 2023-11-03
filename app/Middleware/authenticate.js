require('dotenv').config({path: '/root/microservice_dev/orderMicroservice/.env'})

const jwt = require('jsonwebtoken')
const {TConfUser, TokenStorage} = require('../../models')
const cryptr = require('cryptr')
const crypter = new cryptr('thisIsSecretPassword')

let testMiddleware = async (req, res, next) => {    
    let authHeader = req.headers["authorization"]
    let token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        res.status(400)
            .json({
                status: 'failed',
                message: "unauthorize",
                error: "unauthorize"
            })

        return
    }

    let checkTokenExtitence = await TokenStorage.findOne({attributes: ['token_token'], where: {token_token: token}})

    if (!checkTokenExtitence) {
        res.status(300)
            .json({
                code: 300,
                status: "failed",
                error: "failed login"
            })

        return
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            res.status(400)
                .json({
                    code: 400,
                    status: 'failed',
                    error: err.message
                })

            return
        }

        next()
    })

}

module.exports = testMiddleware