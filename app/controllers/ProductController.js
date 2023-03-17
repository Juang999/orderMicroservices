const {PtMstr, PiMstr, PidDet, PiddDet, InvcMstr, EnMstr, sequelize} = require('../../models')
const rawSequelize = require('../../config/connection')

const ProductController = {
    index: async (req, res) => {
        try {
            let offset = req.query.page * 10
            let limit = 10
    
            let query = `SELECT pt_mstr.pt_desc1 as description, pt_mstr.pt_id, pt_mstr.pt_clothes_id, en_mstr.en_desc as entity FROM public.pt_mstr as pt_mstr 
                        LEFT JOIN public.en_mstr as en_mstr ON pt_mstr.pt_en_id = en_mstr.en_id
                        LIMIT ${limit} OFFSET ${offset-limit}`
    
            const [results, metadata] = await rawSequelize.query(query)

            for (const result of results) {
                let nameWarehouse = 'GUDANG BARANG JADI '+ result.entity.toUpperCase()

                let thisStock = await InvcMstr.findOne({
                    where: rawSequelize.literal(`invc_loc_id = (SELECT loc_id FROM public.loc_mstr AS loc_mstr WHERE loc_desc = '${nameWarehouse}') AND invc_pt_id = ${result.pt_id}`),
                    attributes: ['invc_qty_available', 'invc_qty_show_available']
                })

                if (thisStock == null || thisStock == true && thisStock.invc_qty_available == null) {
                    result.stock = 0
                } else if (thisStock == true && thisStock.invc_qty_available != null) {
                    result.stock = Math.ceil(stock.invc_qty_available / stock.invc_qty_show_available)
                }
            }

            let data = {
                data: results,
                totalData: limit,
                page: req.query.page
            }

            res.status(200)
                .json({
                    status: 'success',
                    message: 'success to get data',
                    data: data
                })
        } catch (error) {
            res.status(400)
                .json({
                    status: 'failed',
                    message: 'failed to get data',
                    error: error.response.data
                })
        }
    },
    show: (req, res) => {
        PtMstr.findOne({
            where: {
                pt_id: req.params.pt_id
            },
            attributes: ['pt_en_id','pt_id', 'pt_clothes_id']
        }).then(result => {
            res.status(200)
                .json({
                    status: "berhasil",
                    message: "berhasil mengambli data",
                    data: result
                })
        }).catch(err => {
            res.status(400)
                .json({
                    status: "gagal",
                    message: "gagal mengambil data",
                    error: err.message
                })
        })
    },
    detailProduct: async (req, res) => {
        try {
            let entity = await EnMstr.findOne({
                where: {
                    en_id: req.params.en_id
                }
            })

            InvcMstr.findOne({
                where: {
                    invc_loc_id: {
                        include: [

                        ]
                    }
                }
            })
        } catch (error) {
            
        }
    }
}

module.exports = ProductController