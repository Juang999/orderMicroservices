const {Sequelize, Op} = require('sequelize')
const {TConfUser, PtnrMstr, PtnraAddr, PtnracCntc, PtnrgGrp, CodeMstr, EnMstr} = require('../../models')

const {v4: uuidv4} = require('uuid')
const helper = require('../../helper/helper')
const moment = require('moment')
let date = moment().tz('Asia/Jakarta').format('YYYY-MM-DD') +' '+ moment().tz('Asia/Jakarta').format('HH:mm:ss.SSS');

const PartnerController = {
    getPartner: (req, res) => {
        let whereClause = {
            ptnr_is_cust: 'Y',
            ptnr_is_emp: 'N',
            ptnr_active: 'Y'
        }

        if (req.query.name) whereClause.ptnr_name = {[Op.like]: `%${req.query.name}%`}
        if (req.query.is_vendor) whereClause.ptnr_is_vend = req.query.is_vendor

        let page = (req.query.page == null) ? 1 : req.query.page
        let offset = page * 10 - 10
        let limit = 20

        PtnrMstr.findAll({
            where: whereClause,
            offset: offset,
            limit: limit,
            attributes: ['ptnr_oid', 'ptnr_id', 'ptnr_name', 'ptnr_add_date', 'ptnr_ptnrg_id'],
            order: [['ptnr_add_date', 'desc']],
            include: [
                {
                    model: PtnrgGrp,
                    as: 'ptnr_group',
                    attributes: ['ptnrg_desc']
                }
            ]
        }).then(result => {
            let final = {
                data: result,
                page: page,
                total_data: limit
            }
            res.status(200)
                .json({
                    status: "success",
                    message: "berhasil mengambil data",
                    data: final
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

        PtnrMstr.create({
            ptnr_oid: uuidv4(),
            ptnr_dom_id: 1,
            ptnr_en_id: req.body.entityId,
            ptnr_add_by: authUser.usernama,
            ptnr_add_date: date,
            ptnr_id: ptnr_id,
            ptnr_code: partner_code,
            ptnr_name: (req.body.partnerName)? req.body.partnerName : null,
            ptnr_ptnrg_id: (req.body.partnerGroupId)? req.body.partnerGroupId : 'N',
            ptnr_is_cust: (req.body.partnerIsCustomer)? req.body.partnerIsCustomer : 'N',
            ptnr_is_vend: (req.body.partnerIsVendor)? req.body.partnerIsVendor : 'N',
            ptnr_active: (req.body.partnerActive)? req.body.partnerActive : 'N',
            ptnr_dt: date,
            ptnr_ac_ar_id: 0,
            ptnr_sb_ar_id: 0,
            ptnr_cc_ar_id: 0,
            ptnr_ac_ap_id: 0,
            ptnr_sb_ap_id: 0,
            ptnr_cc_ap_id: 0,
            ptnr_cu_id: (req.body.partnerCurrencyId) ? req.body.partnerCurrencyId : null,
            ptnr_limit_credit: 0,
            ptnr_is_member: (req.body.partnerIsMember) ? req.body.partnerIsMember : 'N',
            ptnr_is_emp: (req.body.partnerIsEmployee) ? req.body.partnerIsEmployee : 'N',
            ptnr_is_writer: (req.body.partnerIsWriter) ? req.body.partnerIsWriter : 'N',
            ptnr_transaction_code_id: (req.body.partnerTransactionCodeId) ? req.body.partnerTransactionCodeId : null,
            ptnr_email: (req.body.partnerEmail) ? req.body.partnerEmail : null,
            ptnr_address_tax: '-',
            ptnr_contact_tax: '-',
            ptnr_name_alt: (req.body.partnerNameAlternative) ? req.body.partnerNameAlternative : null,
            ptnr_is_ps: (req.body.partnerIsPs) ? req.body.partnerIsPs : null,
            ptnr_start_periode: moment().tz('Asia/Jakarta').format('YYYYMMDD'),
            ptnr_is_bm: (req.body.partnerIsBm) ? req.body.partnerIsBm : 'N',
            ptnr_sex: (req.body.partnerSex) ? req.body.partnerSex : null,
            ptnr_goldarah: req.body.partnerBloodGroup,
            ptnr_birthday: moment(req.body.partnerDateBirthday).format('YYYY-MM-DD'),
            ptnr_negara: req.body.partnerNation,
            ptnr_bp_date: (req.body.partnerBpType) ? moment(req.body.partnerBpDate).format('YYYY-MM-DD') : null,
            ptnr_bp_type: (req.body.partnerBpType) ? req.body.partnerBpType : null,
            ptnr_is_volunteer: (req.body.partnerIsVolunteer) ? req.body.partnerIsVolunteer : null,
            ptnr_is_sbm: (req.body.partnerIsSbm) ? req.body.partnerIsSbm : 'N',
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
                    model: CodeMstr,
                    as: 'ptnr_gender',
                    attributes: ['code_field', 'code_code', 'code_name', 'code_desc']

                },
                {
                    model: CodeMstr,
                    as: 'ptnr_transaction',
                    attributes: ['code_field', 'code_code', 'code_name', 'code_desc']
                },
                {
                    model: CodeMstr,
                    as: 'ptnr_blood_group',
                    attributes: ['code_field', 'code_code', 'code_name', 'code_desc']
                },
                {
                    model: CodeMstr,
                    as: 'ptnr_nation',
                    attributes: ['code_field', 'code_code', 'code_name', 'code_desc']
                },
                {
                    model: CodeMstr,
                    as: 'ptnr_sales_type',
                    attributes: ['code_field', 'code_code', 'code_name', 'code_desc']
                },
                {
                    model: EnMstr,
                    as: 'ptnr_entity',
                    attributes: ['en_id', 'en_desc']
                },
                {
                    model: PtnrgGrp,
                    as: 'ptnr_group',
                    attributes: ['ptnrg_desc']
                },
                {
                    model: PtnraAddr,
                    as: 'address_partner',
                    attributes: ['ptnra_oid', 'ptnra_line', 'ptnra_line_1', 'ptnra_line_2', 'ptnra_line_3', 'ptnra_phone_1', 'ptnra_fax_1', 'ptnra_zip']
                },
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
    getCustomer: async (req, res) => {
        try {
            let authUser = await helper.auth(req.get('authorization'));
    
            let result = await PtnrMstr.findAll({
                where: {
                    ptnr_id: {
                        [Op.in]: Sequelize.literal(`(SELECT )`)
                    }
                }
            })
        } catch (error) {
            
        }
    }
}

module.exports = PartnerController