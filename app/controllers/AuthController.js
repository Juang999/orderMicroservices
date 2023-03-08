const {TConfUser} = require("../../models")
const encryptpwd = require('encrypt-with-password')
let text = 'topSecretPassword'
const cryptr = require('cryptr')
const crypter = new cryptr('thisIsSecretPassword')

const AuthController = {
    login: async (req, res) => {
        try {
            let user = await TConfUser.findOne({
                where: {
                    usernama: req.body.username
                },
                attributes: ['usernama', 'password']
            })

            if (user == null) {
                res.status(400)
                    .json({
                        status: "ditolak",
                        message: "gagal login"
                    })
                
                return
            }
            
            if (req.body.password != user.password) {
                res.status(400)
                    .json({
                        status: "ditolak",
                        message: "gagal login"
                    })

                return
            }

            let data = {
                name: user.usernama,
                security_word: await crypter.encrypt(user.password),
            }

            res.status(200)
                .json({
                    status: "berhasil",
                    data: data
                })
        } catch (error) {
            res.status(400)
                .json({
                    status: "gagal",
                    error: error.message
                })
        }
    },
    authenticate: async (req, res) => {
        try {
            let authUser = await TConfUser.findOne({
                where: {
                    usernama: req.body.username
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

            let verifyPassword = await crypter.decrypt(req.body.password)
            if (verifyPassword != authUser.password) {
                res.status(403)
                    .json({
                        message: "false"
                    })
            
                    return
            }

            res.status(200)
                .json({
                    result: true
                })
        } catch (error) {
            res.status(403)
                .json({
                    message: "error, please report to customer service"
                })
        }
    }
}

module.exports = AuthController