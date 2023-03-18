const {PtMstr, PiMstr, PidDet, PiddDet, InvcMstr, EnMstr, sequelize} = require('../../models')
const rawSequelize = require('../../config/connection')

const ProductController = {
    index: async (req, res) => {
        try {
            let offset = req.query.page * 10
            let limit = 10
    
            let query = `with warehouse_location as (select loc_id, loc_desc from public.loc_mstr )SELECT pt_mstr.pt_desc1 as product_name, pt_mstr.pt_id, pt_mstr.pt_clothes_id, en_mstr.en_desc as entity, 
            (select loc_id from warehouse_location where loc_desc = concat('GUDANG', ' ', 'BARANG', ' ', 'JADI', ' ', upper(en_mstr.en_desc))) as loc_id  FROM public.pt_mstr as pt_mstr 
                        LEFT JOIN public.en_mstr as en_mstr ON pt_mstr.pt_en_id = en_mstr.en_id
                        LIMIT ${limit} OFFSET ${offset-limit}`
    
            const [results, metadata] = await rawSequelize.query(query)

            for (const result of results) {
                let thisStock = null

                if (result.loc_id != null) {
                    thisStock = await InvcMstr.findOne({
                        where: {
                            invc_loc_id: result.loc_id
                        },
                        attributes: ['invc_qty_available', 'invc_qty_show_available']
                    })
                } else {
                    thisStock = null
                }

                let firstValue = thisStock?.invc_qty_available
                let secondValue = thisStock?.invc_qty_show_available

                // result.stock = (thisStock == null || firstValue == true && secondValue == null) ? 0 : firstValue/secondValue;
                result.stock = (firstValue && secondValue) ? Math.round(firstValue) : 0;

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
            console.log(error)
            res.status(400)
                .json({
                    status: 'failed',
                    message: 'failed to get data',
                    error: error.message
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