require('dotenv').config()
const {TConfUser} = require("../../models")
const encryptpwd = require('encrypt-with-password')
let text = 'topSecretPassword'
const cryptr = require('cryptr')
const crypter = new cryptr('thisIsSecretPassword')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

const AuthController = {
    login: (req, res) => {
        TConfUser.findOne({
            where: {
                usernama: req.body.username
            },
            attributes: ['userid', 'usernama', 'password']
        }).then(async result => {
            if (result == null) {
                res.status(400)
                    .json({
                        status: "ditolak",
                        message: "gagal login"
                    })
                
                return
            }
            
            if (req.body.password != result.password) {
                res.status(400)
                    .json({
                        status: "ditolak",
                        message: "gagal login"
                    })

                return
            }

            let data = {
                userid: result.userid,
                name: result.usernama,
                security_word: await crypter.encrypt(result.password),
            }

            let token = await jwt.sign(data, process.env.ACCESS_TOKEN_SECRET)

            res.status(200)
                .json({
                    status: "berhasil",
                    data: token
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "gagal",
                    message: err.message
                })
        })
    },
    authenticate: async (req, res) => {
        try {
            if (!req.body.secret_key) {
                res.status(300)
                    .json({
                        result: "forbidden",
                        message: "forbidden",
                        errorType: 1
                    })
                
                return
            }

            let secretKey = CryptoJS.AES.decrypt(req.body.secret_key, 'key').toString(CryptoJS.enc.Utf8)

            if (secretKey != 'Aggregation Microservice') {
                res.status(300)
                    .json({
                        result: "forbidden",
                        message: "forbidden"
                    })
                
                return
            }

            jwt.verify(req.body.accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
                if(err) {
                    res.sendStatus(400)
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

            })

            res.status(200)
                .json({
                    result: true
                })
        } catch (error) {
            res.status(403)
                .json({
                    result: false,
                    message: "error, please report to customer service"
                })
        }
    }
}

module.exports = AuthController