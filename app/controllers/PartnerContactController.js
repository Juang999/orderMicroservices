const {PtnracCntc} = require('../../models')
// const {Sequelize, Op} = require('sequelize')
const {v4: uuidv4} = require('uuid')
const helper = require('../../helper/helper')
const moment = require('moment')
let date = moment().tz('Asia/Jakarta').format('YYYY-MM-DD') +' '+ moment().tz('Asia/Jakarta').format('HH:mm:ss.SSS');

const PartnerContactController = {
    create: async (req, res) => {
        let authUser = await helper.auth(req.get('authorization'))

        let lastConcactPersonCustomer = await PtnracCntc.findOne({
            where: {
                addrc_ptnra_oid: req.body.pertnerAccountAddressOid
            },
            attributes: ['ptnrac_seq']
        })

        let seq = (lastConcactPersonCustomer != null) ? lastConcactPersonCustomer.ptnrac_seq + 1 : 1

        PtnracCntc.create({
            ptnrac_oid: uuidv4(),
            addrc_ptnra_oid: req.body.pertnerAccountAddressOid,
            ptnrac_add_by: authUser.usernama,
            ptnrac_add_date: moment().tz('Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ss'),
            ptnrac_seq: seq,
            ptnrac_function: req.body.partnerAccountFunction, 
            ptnrac_contact_name: req.body.partnerContactName,
            ptnrac_phone_1: req.body.partnerPhone1,
            ptnrac_phone_2: req.body.partnerContact2,
            ptnrac_email: req.body.partnerContactEmail,
            ptnrac_dt: date
        }).then(result => {
            res.status(200)
                .json({
                    status: "success",
                    message: "berhasil membuat data kontak personal",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "failed",
                    message: "gagal membuat kontak personal",
                    error: err.message
                })
        })
    },
    show: (req, res) => {
        PtnracCntc.findOne({
            where: {
                ptnrac_oid: req.params.ptnrac_oid
            }
        }).then(result => {
            res.status(200)
                .json({
                    status: "success",
                    message: "berhasil mengambil data",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "failed",
                    message: "gagal mengambil data",
                    error: err.message
                })
        })
    }
}

module.exports = PartnerContactController