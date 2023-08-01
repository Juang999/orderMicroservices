require('dotenv').config()

const jwt = require('jsonwebtoken')
const {TConfUser} = require('../../models')
const cryptr = require('cryptr')
const crypter = new cryptr('thisIsSecretPassword')

let adminAuthenticate = (req, res, next) => {
    let authHeader = req.headers["authorization"]
    let token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        res.status(400)
            .json({
                code: 400,
                status: 'failed',
                message: "unauthorize",
                error: "unauthorize"
            })

        return
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            if (err.message == 'jwt expired') {
                res.status(400)
                    .json({
                        code: 400,
                        status: err.message,
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
            attributes: ['usernama', 'password', 'groupid']
        })

        if (!authUser) {
            res.status(403)
                .json({
                    code: 403,
                    status: "unauthorize",
                    error: "unauthorize"
                })

            return
        }

        console.log(authUser.groupid)

        if (authUser.groupid != 1) {
            res.status(403)
                .json({
                    code: 403,
                    status: "unauthorize",
                    error: "unauthorize"
                })

            return
        }

        let verifyPassword = await crypter.decrypt(user.security_word)
        if (verifyPassword != authUser.password) {
            res.status(403)
                .json({
                    code: 403,
                    status: 'failed login',
                    error: 'wrong username or password',
                })
        
                return
        }

        next()
    })
}

module.exports = adminAuthenticate