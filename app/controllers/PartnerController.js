const {Sequelize, Op} = require('sequelize')
const {TConfUser, PtnrMstr, PtnraAddr, PtnracCntc} = require('../../models')
const {v4: uuidv4} = require('uuid')
const helper = require('../../helper/helper')
const moment = require('moment')
let date = moment().tz('Asia/Jakarta').format('YYYY-MM-DD') +' '+ moment().tz('Asia/Jakarta').format('HH:mm:ss.SSS');

const PartnerController = {
    getPartner: (req, res) => {
        TConfUser.findAll({
            where: {
                user_ptnr_id: {
                    [Op.not]: null,
                    [Op.in]: Sequelize.literal(`(SELECT ptnr_id FROM public.ptnr_mstr WHERE ptnr_is_emp = 'Y')`)
                }
            },
            attributes: ["userid", "usernama", "user_ptnr_id"]
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
    },
    createNewPartner: async (req, res) => {
        let authUser = await helper.auth(req.get("authorization"))

        // getLastIdFromTable ptnr_mstr
        let lastCustomer = await PtnrMstr.findOne({
            where: {
                ptnr_is_cust: 'Y'
            },
            order: [['ptnr_id', 'desc']],
            attributes: ['ptnr_id']
        })

        let ptnr_id = lastCustomer.ptnr_id + 1;

        let ptnr_code = ''

        ptnr_code = (req.body.partnerIsCustomer == 'Y') ? `${ptnr_code}CU` : `${ptnr_code}`
        ptnr_code = (req.body.partnerIsVendor == 'Y') ? `${ptnr_code}SP` : `${ptnr_code}`
        ptnr_code = (req.body.partnerIsMember == 'Y') ? `${ptnr_code}SL` : `${ptnr_code}`
        ptnr_code = (req.body.partnerIsEmployee == 'Y') ? `${ptnr_code}EM` : `${ptnr_code}`
        ptnr_code = (req.body.partnerIsWriter == 'Y') ? `${ptnr_code}WR` : `${ptnr_code}`

        let base_zero = '0000000'
        
        let string = ptnr_id.toString()

        let partner_code = ptnr_code + '00' + req.body.entityId + base_zero.substring(0, base_zero.length - string.substring(4).length) + string.substring(4)

        let dataCustomer = await PtnrMstr.create({
            ptnr_oid: uuidv4(),
            ptnr_dom_id: 1,
            ptnr_en_id: req.body.entityId,
            ptnr_add_by: authUser.usernama,
            ptnr_add_date: date,
            ptnr_id: ptnr_id,
            ptnr_code: partner_code,
            ptnr_name: req.body.partnerName,
            ptnr_ptnrg_id: req.body.partnerGroupId,
            ptnr_is_cust: req.body.partnerIsCustomer,
            ptnr_is_vend: req.body.partnerIsVendor,
            ptnr_active: req.body.partnerActive,
            ptnr_dt: date,
            ptnr_ac_ar_id: 0,
            ptnr_sb_ar_id: 0,
            ptnr_cc_ar_id: 0,
            ptnr_ac_ap_id: 0,
            ptnr_sb_ap_id: 0,
            ptnr_cc_ap_id: 0,
            ptnr_cu_id: req.body.partnerCurrencyId,
            ptnr_limit_credit: 0,
            ptnr_is_member: req.body.partnerIsMember,
            ptnr_is_emp: req.body.partnerIsEmployee,
            ptnr_is_writer: req.body.partnerIsWriter,
            ptnr_transaction_code_id: req.body.partnerTransactionCodeId,
            ptnr_email: req.body.partnerEmail,
            ptnr_address_tax: '-',
            ptnr_contact_tax: '-',
            ptnr_name_alt: req.body.partnerNameAlternative,
            ptnr_is_ps: req.body.partnerIsPs,
            ptnr_start_periode: moment().tz('Asia/Jakarta').format('YYYYMMDD'),
            ptnr_is_bm: req.body.partnerIsBm,
            ptnr_sex: req.body.partnerSex,
            ptnr_goldarah: req.body.partnerBloodGroup,
            ptnr_birthday: moment(req.body.partnerDateBirthday).format('YYYY-MM-DD'),
            ptnr_negara: req.body.partnerNation,
            ptnr_bp_date: moment(req.body.partnerBpDate).format('YYYY-MM-DD'),
            ptnr_bp_type: req.body.partnerBpType,
            ptnr_is_volunteer: req.body.partnerIsVolunteer,
            ptnr_is_sbm: req.body.partnerIsSbm,
        }).then(result => {
            res.status(200)
                .json({
                    status: "success",
                    message: 'berhasil membuat customer baru',
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "failed",
                    message: "gagal membuat customer baru",
                    error: err.message
                })
        })
    },
    createAddressPartner: async (req, res) => {
        // getLastIdFromTable ptnra_addr
        let authUser = await helper.auth(req.get('authorization'))

        let lastAddressCustomer = await PtnraAddr.findOne({
            where: {
                ptnra_active: 'Y'
            },
            order: [['ptnra_id', 'desc']],
            attributes: ['ptnra_id']
        })

        let ptnra_id = lastAddressCustomer.ptnra_id + 1
        
        PtnraAddr.create({
            ptnra_oid: uuidv4(),
            ptnra_id: ptnra_id,
            ptnra_dom_id: req.body.partnerDomainId,
            ptnra_en_id: req.body.partnerEntityId,
            ptnra_add_by: authUser.usernama,
            ptnra_add_date: moment().tz('Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ss'),
            ptnra_line_1: req.body.partnerLine1,
            ptnra_line_2: req.body.partnerLine2,
            ptnra_line_3: req.body.partnerLine3,
            ptnra_phone_1: req.body.partnerPhone1,
            ptnra_phone_2: req.body.partnerPhone2,
            ptnra_fax_1: req.body.partnerFax1,
            ptnra_fax_2: req.body.partnerFax2,
            ptnra_zip: req.body.partnerZip,
            ptnra_ptnr_oid: req.body.partnerOid,
            ptnra_addr_type: req.body.partnerAddressType,
            ptnra_comment: req.body.partnerComment,
            ptnra_active: (req.body.ptnra_active) ? req.body.ptnra_active : 'Y',
            ptnra_dt: date
        }).then(result => {
            res.status(200)
                .json({
                    status: "success",
                    message: "berhasil membuat data",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "failed",
                    message: "gagal membuat data",
                    error: err.message
                })
        })
    },
    createContactPerson: async (req, res) => {
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
    getDetailCustomer: async (req, res) => {
        let authUser = await helper.auth(req.get('authorization'))

        PtnrMstr.findOne({
            where: {
                ptnr_oid: req.params.ptnr_oid,
                ptnr_id: {
                    [Op.not]: authUser.user_ptnr_id
                }
            },
            include: [
                {
                    model: PtnraAddr,
                    as: 'address_partner'
                }
            ]
        }).then(result => {
            res.status(200)
                .json({
                    status: "success",
                    message: "berhasil mengambil data customer",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: 'failed',
                    message: 'gagal mengambil data',
                    error: err.message
                })
        })
    },
    getDetailAddressCustomer: (req, res) => {
        PtnraAddr.findAll({
            where: {
                ptnra_oid: req.params.ptnra_oid
            },
            include: [
                {
                    model: PtnracCntc,
                    as: 'contact_person'
                }
            ]
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

module.exports = PartnerController