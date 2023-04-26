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

        ptnr_code = (req.body.ptnr_is_cust == 'Y') ? `${ptnr_code}CU` : `${ptnr_code}`
        ptnr_code = (req.body.ptnr_is_vend == 'Y') ? `${ptnr_code}SP` : `${ptnr_code}`
        ptnr_code = (req.body.ptnr_is_member == 'Y') ? `${ptnr_code}SL` : `${ptnr_code}`
        ptnr_code = (req.body.ptnr_is_emp == 'Y') ? `${ptnr_code}EM` : `${ptnr_code}`
        ptnr_code = (req.body.ptnr_is_writer == 'Y') ? `${ptnr_code}WR` : `${ptnr_code}`

        let base_zero = '0000000'
        
        let string = ptnr_id.toString()

        let partner_code = ptnr_code + '00' + req.body.ptnr_en_id + base_zero.substring(0, base_zero.length - string.substring(4).length) + string.substring(4) 

        let dataCustomer = await PtnrMstr.create({
            ptnr_oid: uuidv4(),
            ptnr_dom_id: 1,
            ptnr_en_id: req.body.ptnr_en_id,
            ptnr_add_by: authUser.usernama,
            ptnr_add_date: date,
            ptnr_id: ptnr_id,
            ptnr_code: partner_code,
            ptnr_name: req.body.ptnr_name,
            ptnr_ptnrg_id: req.body.ptnr_ptnrg_id,
            // ptnr_url: req.body.ptnr_url,
            // ptnr_remarks: req.body.ptnr_remarks,
            // ptnr_parent: req.body.ptnr_parent,
            ptnr_is_cust: req.body.ptnr_is_cust,
            ptnr_is_vend: req.body.ptnr_is_vend,
            ptnr_active: req.body.ptnr_active,
            ptnr_dt: date,
            ptnr_ac_ar_id: 0,
            ptnr_sb_ar_id: 0,
            ptnr_cc_ar_id: 0,
            ptnr_ac_ap_id: 0,
            ptnr_sb_ap_id: 0,
            ptnr_cc_ap_id: 0,
            ptnr_cu_id: req.body.ptnr_cu_id,
            ptnr_limit_credit: 0,
            ptnr_is_member: req.body.ptnr_is_member,
            // ptnr_prepaid_balance: req.body.ptnr_prepaid_balance,
            ptnr_is_emp: req.body.ptnr_is_emp,
            // ptnr_npwp: req.body.ptnr_npwp,
            // ptnr_nppkp: req.body.ptnr_nppkp,
            ptnr_is_writer: req.body.ptnr_is_writer,
            ptnr_transaction_code_id: req.body.ptnr_transaction_code_id,
            ptnr_email: req.body.ptnr_email,
            ptnr_address_tax: req.body.ptnr_address_tax,
            ptnr_contact_tax: req.body.ptnr_contact_tax,
            ptnr_name_alt: req.body.ptnr_name_alt,
            ptnr_is_ps: req.body.ptnr_is_ps,
            // ptnr_lvl_id: req.body.ptnr_lvl_id,
            ptnr_start_periode: moment().tz('Asia/Jakarta').format('YYYYMMDD'),
            // ptnr_user_name: req.body.ptnr_user_name,
            ptnr_is_bm: req.body.ptnr_is_bm,
            // ptnr_bank: req.body.ptnr_bank,
            // ptnr_no_rek: req.body.ptnr_no_rek,
            // ptnr_rek_name: req.body.ptnr_rek_name,
            // ptnr_imei: '-',
            ptnr_sex: req.body.ptnr_sex,
            ptnr_goldarah: req.body.ptnr_goldarah,
            ptnr_birthday: moment(req.body.date_birthday).format('YYYY-MM-DD'),
            // ptnr_birthcity: req.body.ptnr_birthcity,
            ptnr_negara: req.body.ptnr_negara,
            ptnr_bp_date: moment(req.body.ptnr_bp_date).format('YYYY-MM-DD'),
            ptnr_bp_type: req.body.ptnr_bp_type,
            // ptnr_waris_name: req.body.ptnr_waris_name,
            // ptnr_waris_ktp: req.body.ptnr_waris_ktp,
            // ptnr_ktp: req.body.ptnr_ktp,
            ptnr_is_volunteer: req.body.ptnr_is_volunteer,
            ptnr_is_sbm: req.body.ptnr_is_sbm,
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
            ptnra_dom_id: req.body.ptnr_dom_id,
            ptnra_en_id: req.body.ptnr_en_id,
            ptnra_add_by: req.body.ptnr_add_by,
            ptnra_add_date: req.body.ptnr_add_date,
            // ptnra_upd_by: req.body.ptnra_upd_by,
            // ptnra_upd_date: req.body.ptnra_upd_date,
            ptnra_line: req.body.ptnra_line,
            ptnra_line_1: req.body.ptnra_line_1,
            ptnra_line_2: req.body.ptnra_line_2,
            ptnra_line_3: req.body.ptnra_line_3,
            ptnra_phone_1: req.body.ptnra_phone_1,
            ptnra_phone_2: req.body.ptnra_phone_2,
            ptnra_fax_1: req.body.ptnra_fax_1,
            ptnra_fax_2: req.body.ptnra_fax_2,
            ptnra_zip: req.body.ptnra_zip,
            ptnra_ptnr_oid: req.body.ptnr_oid,
            ptnra_addr_type: req.body.ptnra_addr_type,
            ptnra_comment: req.body.ptnra_comment,
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
        let lastConcactPersonCustomer = await PtnracCntc.findOne({
            where: {
                addrc_ptnra_oid: customerAddress.ptnra_oid
            },
            attributes: ['ptnrac_seq']
        })

        let seq = (lastConcactPersonCustomer != null) ? lastAddressCustomer.ptnrac_seq + 1 : 1

        PtnracCntc.create({
            ptnrac_oid: uuidv4(),
            addrc_ptnra_oid: customerAddress.ptnra_oid,
            ptnrac_add_by: customerAddress.ptnra_add_by,
            ptnrac_add_date: customerAddress.ptnra_add_date,
            ptnrac_seq: seq,
            ptnrac_function: req.body.ptnrac_function, 
            ptnrac_contact_name: req.body.contact_name,
            ptnrac_phone_1: req.body.phone_1,
            ptnrac_phone_2: req.body.phone_2,
            ptnrac_email: req.body.email,
            ptnrac_dt: date
            // ptnrac_upd_by: 
            // ptnrac_upd_date:
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
    }
}

module.exports = PartnerController