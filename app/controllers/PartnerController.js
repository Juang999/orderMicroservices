const {Sequelize, Op} = require('sequelize')
const {PtMstr, TConfUser, PtnrMstr} = require('../../models')
const {v4: uuidv4} = require('uuid')
const helper = require('../../helper/helper')
const moment = require('moment')
const momentId = moment().locale('id')

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
        let authUser = helper.auth(req.get("authorization"))

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

        let partner_code = ptnr_code + base_zero.substring(0, base_zero.length - string.substring(4).length) + string.substring(4) 

        let dataCustomer = await PtnrMstr.create({
            ptnr_oid: uuidv4(),
            ptnr_dom_id: 1,
            ptnr_en_id: req.body.ptnr_en_id,
            ptnr_add_by: authUser.usernama,
            ptnr_add_date: momentId.format('YYYY-MM-DD h:mm:ss'),
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
            ptnr_dt: req.body.ptnr_dt,
            ptnr_ac_ar_id: 0,
            ptnr_sb_ar_id: 0,
            ptnr_cc_ar_id: 0,
            ptnr_ac_ap_id: 0,
            ptnr_sb_ap_id: 0,
            ptnr_cc_ap_id: 0,
            ptnr_cu_id: req.body.ptnr_cu_id,
            ptnr_limit_credit: req.body.ptnr_limit_credit,
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
            ptnr_start_periode: req.body.ptnr_start_periode,
            // ptnr_user_name: req.body.ptnr_user_name,
            ptnr_is_bm: req.body.ptnr_is_bm,
            // ptnr_bank: req.body.ptnr_bank,
            // ptnr_no_rek: req.body.ptnr_no_rek,
            // ptnr_rek_name: req.body.ptnr_rek_name,
            // ptnr_imei: '-',
            ptnr_sex: req.body.ptnr_sex,
            ptnr_goldarah: req.body.ptnr_goldarah,
            ptnr_birthday: req.body.ptnr_birthday,
            // ptnr_birthcity: req.body.ptnr_birthcity,
            ptnr_negara: req.body.ptnr_negara,
            ptnr_bp_date: req.body.ptnr_bp_date,
            ptnr_bp_type: req.body.ptnr_bp_type,
            // ptnr_waris_name: req.body.ptnr_waris_name,
            // ptnr_waris_ktp: req.body.ptnr_waris_ktp,
            // ptnr_ktp: req.body.ptnr_ktp,
            ptnr_is_volunteer: req.body.ptnr_is_volunteer,
            ptnr_is_sbm: req.body.ptnr_is_sbm,
        })

        // let customerAddress = 
    }
}

module.exports = PartnerController