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

    let checkTokenExtitence = await TokenStorage.findOne({where: {token_token: token}})

    if (checkTokenExtitence == null) {
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
            if (err.message == 'jwt expired') {
                res.status(400)
                    .json({
                        code: 400,
                        status: 401,
                        error: err.message
                    })
                
                return
            } else {
                res.status(400)
                    .json({
                        code: 400,
                        status: "failed",
                        error: "failed login"
                    })
    
                    return
            }
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
                    code: 403,
                    message: "unauthorize"
                })

            return
        }

        let verifyPassword = await crypter.decrypt(user.security_word)
        if (verifyPassword != authUser.password) {
            res.status(403)
                .json({
                    code: 403,
                    result: false
                })
        
                return
        }

        next()
    })

}

module.exports = testMiddleware