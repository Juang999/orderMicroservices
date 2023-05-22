const {VisitMstr, VisitedDet, PsPeriodeMstr, PtnrMstr} = require('../../models')
const {Sequelize, Op} = require('sequelize')
const helper = require('../../helper/helper')
const moment = require('moment')
const {v4: uuidv4} = require('uuid')
const express = require('express')
const upload = require('express-fileupload')
const path = require('path')
const {Buffer} = require('buffer')
const fs = require('fs')

const app = express()

app.use(upload())

const VisitController = {
    getVisitingSchedule: async (req, res) => {
        try {
            let authUser = await helper.auth(req.get('authorization'))
    
            let where = {
                visit_sales_id: authUser.user_ptnr_id
            }

            if (req.body.periode) {


                let periode = await PsPeriodeMstr.findOne({
                    where: {
                        periode_code: req.query.periode
                    }
                })
    
                where.visit_startdate = {[Op.between]: [periode.periode_start_date, periode.periode_end_date]}
            } else {
                let startDate = moment().startOf('month').format('YYYY-MM-DD')
                let endDate = moment().endOf('momth').format('YYYY-MM-DD')

                where.visit_startdate = {[Op.between]: [startDate, endDate]}
            }

    
            let visitDate = await VisitMstr.findAll({
                where: where,
                attributes: ["visit_code", "visit_startdate", "visit_enddate", "visit_status"]
            })
    
            res.status(200)
                .json({
                    status: "berhasil",
                    message: "berhasil mengambil data tanggal kunjungan",
                    data: visitDate
                })
        } catch (error) {
            console.log(error)
            res.status(400)
                .json({
                    status: "failed",
                    message: "gagal mengambil data tanggal kunjungan",
                    error: error.message
                })
        }
    },
    getDetailVisitSchedule: (req, res) => {
        VisitMstr.findOne({
            where: {
                visit_code: req.params.visit_code
            },
            include: [
                {
                    model: VisitedDet,
                    as: 'visit_detail',
                    attributes: ['visited_oid', 'visited_cus_name', 'visited_cus_phone', 'visited_cus_address', 'visited_type'],
                }
            ],
            attributes: [
                "visit_code", 
                [Sequelize.literal(`concat(replace(to_char(visit_startdate, 'Day'), ' ', ''), ', ', to_char(visit_startdate, 'YYYY'), ' ', replace(to_char(visit_startdate, 'Month'), ' ', ''), ' ', to_char(visit_startdate, 'DD'))`), "visit_startdate"], 
                [Sequelize.literal(`concat(replace(to_char(visit_enddate, 'Day'), ' ', ''), ', ', to_char(visit_enddate, 'YYYY'), ' ', replace(to_char(visit_enddate, 'Month'), ' ', ''), ' ', to_char(visit_enddate, 'DD'))`), "visit_enddate"], 
                "visit_status"
            ]
        }).then(result => {
            res.status(200)
                .json({
                    status: "berhasil",
                    message: "berhasil mengambil detail data tanggal kunjungan",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "gagal",
                    message: "gagal mengambil detail data tanggal kunjungan",
                    error: err.message
                })
        })
    },
    getDetailVisiting: (req, res) => {
        VisitedDet.findOne({
            where: {
                visited_oid: req.params.visited_oid
            }
        }).then(result => {
            res.status(200)
                .json({
                    status: "berhasil",
                    message: "berhasil megambil detail kunjungan",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "gagal",
                    message: "gagal mengambil detail kunjungan",
                    error: err.message
                })
        })
    },
    createSchedule: async (req, res) => {
        try {
            let authUser = await helper.auth(req.get('authorization'))

            let lastData = await VisitMstr.count()

            let totalData = (lastData == 0) ? 1 : lastData + 1;

            let visit_code = `VST0${authUser.en_id}456${moment().format('MMYY')}${totalData}`

            let visit_mstr = await VisitMstr.create({
                visit_code: visit_code,
                visit_startdate: req.body.start_date,
                visit_enddate: req.body.end_date,
                visit_en_id: authUser.en_id,
                visit_sales_id: authUser.user_ptnr_id,
                visit_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                visit_add_by: authUser.usernama,
                visit_status: 'N'
            })

            res.status(200)
                .json({
                    status: "berhasil",
                    message: "berhasil membuat jadwal kunjungan",
                    data: visit_mstr
                })
        } catch (error) {
            res.status(400)
                .json({
                    status: "gagal",
                    message: "gagal membuat jadwal kunjungan",
                    error: error.message
                })
        }
    },
    createListCustomerToVisit: (req, res) => {
        VisitedDet.create({
            visited_oid: uuidv4(),
            visited_visit_code: req.body.visit_code,
            visited_type: req.body.type,
            visited_ptnr_id: req.body.ptnr_id,
            visited_cus_name: req.body.cus_name,
            visited_cus_address: req.body.cus_address,
            visited_cus_phone: req.body.cus_phone
        }).then(result => {
            res.status(200)
                .json({
                    status: "berhasil",
                    message: "berhasil membuat list kostumer",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "gagal",
                    message: "gagal membuat list kostumer",
                    error: err.message
                })
        })
    },
    checkIn: async (req, res) => {
        try {              
            let checkLastData = await VisitedDet.findOne({
                where: {
                    [Op.and]: {
                        visited_check_in: {
                            [Op.not]: null
                        },
                        visited_check_out: {
                            [Op.is]: null
                        },
                        visited_visit_code: {
                            [Op.eq]: req.body.visit_code
                        }
                    }
                }
            })

            const file = JSON.parse(req.body.file)
            const fileName = path.join(__dirname, `../../public/images/checkin/${file.name}`)

            const buffer = Buffer.from(file.data.data, 'base64')

            if (checkLastData) {
                res.status(500)
                    .json({
                        status: "gagal",
                        data: `kamu belum checkout untuk checkout untuk kunjugan ${checkLastData.visited_cus_name}`,
                        visited_oid: checkLastData.visited_oid
                    })
                
                return
            }

            fs.writeFile(fileName, buffer, (err) => {
                if (err) {
                    res.status(400)
                        .json({error: err})
                
                    return
                }
            })

            VisitedDet.update({
                visited_lat_gps_check_in: req.body.checkin_lat,
                visited_long_gps_check_in: req.body.checkin_long,
                visited_address_gps_check_in: req.body.checkin_address,
                visited_check_in: req.body.checkin_checkin,
                visited_foto: `images/${file.name}`
            }, {
                where: {
                    visited_oid: req.params.visited_oid
                }
            })

            res.status(200)
                .json({
                    status: "berhasil",
                    message: "berhasil upload gambar"
                })
        } catch (error) {
            console.log(error)
            res.status(400)
                .json({
                    status: "gagal",
                    message: "gagal upload data",
                    errorr: error.message
                })
        }
    },
    checkOut: (req, res) => {
        VisitedDet.update({
            visited_lat_gps_check_out: req.body.checkout_lat,
            visited_long_gps_check_out: req.body.checkout_long,
            visited_address_gps_check_out: req.body.checkout_address,
            visited_check_out: req.body.checkout_checkout,
        }, {
            where: {
                visited_oid: req.params.visited_oid
            }
        }).then(result => {
            res.status(200)
                .json({
                    status: 'berhasil',
                    message: 'berhasil checkout',
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "gagal",
                    message: "gagal checkout",
                    error: err.message
                })
        })
    }
}

module.exports = VisitController