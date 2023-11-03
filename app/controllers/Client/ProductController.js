const {PtMstr, EnMstr, CodeMstr, PidDet, PiddDet, InvcMstr, PtCatMstr, PtsCatCat, SizeMstr, Sequelize, PiMstr, LocMstr} = require('../../../models')
const {Op} = require('sequelize')
const sequelize = require('sequelize')
const {page} = require('../../../helper/helper')

class ProductController {
	getProductByPriceList = async (req, res) => {
		try {
			let thePage = (req.query.page == null) ? 1 : req.query.page

			let {limit, offset} = page(thePage, 4)

			let data = await PtMstr.findAll({
				limit: limit,
				offset: offset,
				attributes: [
					'pt_desc2', 
					'pt_desc1', 
					'pt_code', 
					'pt_clothes_id', 
					'pt_en_id', 
					'pt_id',
					[Sequelize.col('EnMstr.en_desc'), 'entity'],
					[Sequelize.col('category_product.ptcat_desc'), 'category'],
					[Sequelize.col('sub_category.ptscat_desc'), 'sub_category_product']
				],
				include: [
					{
						model: EnMstr,
						as: 'EnMstr',
						required: true,
						attributes: [],
					}, {
						model: PtCatMstr,
						as: 'category_product',
						required: true,
						attributes: []
					}, {
						model: PtsCatCat,
						as: 'sub_category',
						required: true,
						attributes: []
					}, 
					{
						model: PidDet,
						as: 'price',
						attributes: ['pid_oid', 'pid_pi_oid'],
						include: [
							{
								model: PiMstr,
								as: 'price_list',
								attributes: ['pi_desc']
							}, {
								model: PiddDet,
								as: 'detail_price',
								attributes: [
									'pidd_pid_oid', 
									'pidd_price',
								],
								include: [
									{
										model: CodeMstr,
										as: 'PaymentType',
										attributes: ['code_name']
									}
								]
							}
						]
					}
				],
				where: {
					pt_en_id: {
						[Op.in]: (req.query.entity) ? [req.query.entity] : [1, 2, 3]
					},
					pt_desc1: {
						[Op.like]: (req.query.query) ? `%${req.query.query}%` : '%%'
					},
					pt_cat_id: {
						[Op.in]: (req.query.category) ? [req.query.category] : Sequelize.literal(`(SELECT ptcat_id FROM public.ptcat_mstr)`)
					},
					pt_scat_id: {
						[Op.in]: (req.query.subcategory) ? [req.query.subcategory] : Sequelize.literal(`(SELECT ptscat_id FROM public.ptscat_cat)`)
					},
					pt_id: {
						[Op.in]: Sequelize.literal(`(SELECT DISTINCT(pid_pt_id) FROM public.pid_det ${(req.query.pi_oid) ? `WHERE pid_pi_oid = '${req.query.pi_oid}'` : ''})`)
					}
				},
				order: [['pt_clothes_id', 'asc']],
			})

			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil mengambil data',
					data: data
				})
		} catch (error) {
			res.status(400)
				.json({
					status: 'failed',
					message: 'gagal mengambil data',
					error: error.message
				})
		}
	}

	showProductByPriceList = (req, res) => {
		PtMstr.findOne({
			where: {
				[Op.and]: {
					pt_id: {
						[Op.eq]: req.params.pt_id
					},
				}
			},
			attributes: ['pt_id', 'pt_desc1', 'pt_desc2', 'pt_code', 'pt_clothes_id', 'pt_color_tag'],
			include: [
				{
					model: EnMstr,
					as: 'EnMstr',
					attributes: ['en_id', 'en_desc']
				},{
					model: PidDet,
					as: 'price',
					attributes: ['pid_oid', 'pid_pt_id', 'pid_pi_oid'],
					where: {
						pid_pi_oid: req.query.price_list
					},
					include: [
						{
							model: PiMstr,
							as: 'price_list',
							attributes: ['pi_oid', 'pi_desc']
						}, {
							model: PiddDet,
							as: 'detail_price',
							attributes: ['pidd_price', 'pidd_disc'],
							include: [
								{
									model: CodeMstr,
									as: 'PaymentType',
									attributes: ['code_code', 'code_id', 'code_desc']
								}
							]
						}
					]
				}, {
					model: PtCatMstr,
					as: 'category_product',
					attributes: ['ptcat_desc']
				}, {
					model: PtsCatCat,
					as: 'sub_category',
					attributes: ['ptscat_desc']
				}, {
					model: SizeMstr,
					as: 'size',
					attributes: ['size_desc']
				}
			]
		}).then( async result => {
			let qtyProduct = await InvcMstr.findAll({
				attributes: ['invc_qty_available'],
				where: {
					invc_pt_id: result.dataValues.pt_id,
					invc_loc_id: {
						[Op.in]: [10001, 200010, 30008]
					}
				}
			})

			result.dataValues.status = (qtyProduct == 0) ? 'PRE-ORDER' : 'DIJUAL'
			result.dataValues.Qty = qtyProduct

			return result
		}).then( result => {
			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil mengambil detail data',
					data: result
				})
		}).catch(err => {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal mengambil detail data',
					error: err.message
				})
		})
	}

	getProductByLocation = (req, res) => {
		let thePage = (req.query.page == null) ? 1 : req.query.page

		let {limit, offset} = page(thePage, 4)

		PtMstr.findAll({
			limit: limit,
			offset: offset,
			attributes: [
				'pt_desc2', 
				'pt_desc1', 
				'pt_code', 
				'pt_clothes_id', 
				'pt_en_id', 
				'pt_id',
				[Sequelize.col('EnMstr.en_desc'), 'entity'],
				[Sequelize.col('category_product.ptcat_desc'), 'category'],
				[Sequelize.col('sub_category.ptscat_desc'), 'sub_category_product']
			],
			order: [['pt_clothes_id', 'asc']],
			include: [
				{
					model: InvcMstr,
					as: 'Qty',
					distinct: true,
					attributes: [
						'invc_oid',
						'invc_qty_available',
					],
					include: [
						{
							model: LocMstr,
							as: 'location',
							attributes: ['loc_desc']
						}
					],
					where: {
						invc_loc_id: {
							[Op.in]: (req.query.loc_id) ? [req.query.loc_id] : [10001, 200010, 300018]
						}
					}
				}, {
					model: EnMstr,
					as: 'EnMstr',
					required: true,
					attributes: [],
				}, {
					model: PtCatMstr,
					required: true,
					as: 'category_product',
					attributes: []
				}, {
					model: PtsCatCat,
					required: true,
					as: 'sub_category',
					attributes: []
				},
			],
			where: {
				pt_desc1: {
					[Op.like]: (req.query.query) ? `%${req.query.query}%` : '%%'
				},
				pt_en_id: {
					[Op.in]: (req.query.entity) ? [req.query.entity] : [1, 2, 3]
				},
				pt_cat_id: {
					[Op.in]: (req.query.category) ? [req.query.category] : Sequelize.literal(`(SELECT ptcat_id FROM public.ptcat_mstr)`)
				},
				pt_scat_id: {
					[Op.in]: (req.query.subcategory) ? [req.query.subcategory] : Sequelize.literal(`(SELECT ptscat_id FROM public.ptscat_cat)`)
				},
				pt_id: {
					[Op.in]: Sequelize.literal(`(SELECT invc_pt_id FROM public.invc_mstr WHERE invc_loc_id IN (${(req.query.loc_id) ? [req.query.loc_id] : [10001, 200010, 300018]}))`)
				}
			}
		}).then(result => {
			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil mengambil data produk berdasarkan lokasi',
					data: result
				})
		}).catch(err => {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal mengambil data produk berdasarkan lokasi',
					error: err.message
				})
		})
	}

	showProductByLocation = (req, res) => {
		let idLocation = []

		switch (parseInt(req.query.entity)) {
			case 1:
				idLocation.push(10001)
				break;

			case 2:
				idLocation.push(200010)
				break

			case 3:
				idLocation.push(300018)
				break

			default:
				idLocation.push(10001)
				idLocation.push(200010)
				idLocation.push(300018)
				break
			}

		PtMstr.findOne({
			attributes: [
				'pt_id', 
				'pt_desc1', 
				'pt_desc2', 
				'pt_clothes_id', 
				'pt_en_id',
				'pt_color_tag',
				[Sequelize.col('EnMstr.en_desc'), 'entity']
			],
			include: [
				{
					model: EnMstr,
					as: 'EnMstr',
					required: true,
					attributes: []
				}, {
					model: PtCatMstr,
					as: 'category_product',
					attributes: ['ptcat_desc']
				}, {
					model: PtsCatCat,
					as: 'sub_category',
					attributes: ['ptscat_desc']
				}, {
					model: SizeMstr,
					as: 'size',
					attributes: ['size_desc']
				}, {
					model: InvcMstr,
					as: 'Qty',
					attributes: [
						'invc_qty_available',
						'invc_loc_id'
					],
					where: {
						invc_loc_id: {
							[Op.in]: [idLocation]
						}
					},
					include: [
						{
							model: LocMstr,
							as: 'location',
							attributes: [
								'loc_id', 
								'loc_desc'
							],
						}
					]
				},
				{
					model: PidDet,
					as: 'price',
					attributes: [
						'pid_oid', 
						'pid_pi_oid'
					],
					include: [
						{
							model: PiMstr,
							as: 'price_list',
							attributes: [
								'pi_oid', 
								'pi_desc'
							]
						}, {
							model: PiddDet,
							as: 'detail_price',
							attributes: [
								'pidd_price', 
								'pidd_disc',
							],
							include: [
								{
									model: CodeMstr,
									as: 'PaymentType',
									attributes: [
										'code_code', 
										'code_id', 
										'code_desc'
									]
								}
							]
						}
					]
				}
			],
			where: {
				pt_id: {
					[Op.eq]: req.params.pt_id
				}
			},
		}).then(result => {
			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil mengambil detail data',
					data: result
				})
		}).catch(err => {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal mengambil detail data',
					error: err.message
				})
		})
	}

	getPriceList = async (req, res) => {
		PiMstr.findAll({
			attributes: ['pi_oid', 'pi_desc', 'pi_start_date', 'pi_end_date']
		}).then(result => {
			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil mengambil data price list',
					data: result
				})
		}).catch(err => {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal mengambil data price list',
					error: err.message
				})
		})
	}

	getCategory = (req, res) => {
		PtCatMstr.findAll({
			attributes: ['ptcat_id', 'ptcat_desc']
		}).then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'berhasil mengambil data',
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
	}

	getSubCategory = (req, res) => {
		PtsCatCat.findAll({
			attributes: ['ptscat_id', 'ptscat_desc'],
			where: {
				ptscat_ptcat_id: req.params.cat_id
			}
		}).then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'berhasil mengambil data',
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
	}

	getSize = (req, res) => {
		SizeMstr.findAll({
			attributes: ['size_id', 'size_code', 'size_name', 'size_desc'],
			order: [['size_name', 'asc']]
		}).then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'berhasil mengambil data',
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
	}

	getAllProduct = (req, res) => {
		let current_page = (req.query.page) ? req.query.page : 1
		let {page, limit, offset} = page(current_page, limit)

		let where = {pt_pl_id: 1, pt_desc1: {[Op.not]: null}}

		if (req.query.entity > 0) where.pt_en_id = req.query.entity
		if (req.query.category) where.pt_cat_id = req.query.category
		if (req.query.subcategory) where.pt_scat_id = req.query.subcategory
		if (req.query.query) where.pt_desc2 = {[Op.like]: `%${req.query.query}%`}

		PtMstr.findAndCountAll({
			limit: limit,
			offset: offset,
			attributes: ['pt_code', 'pt_desc1'],
			where: where,
			order: [['pt_desc1', 'asc']],
			include: [
				{
					model: EnMstr,
					as: 'EnMstr',
					attributes: ['en_desc']
				},
				{
					model: PtCatMstr,
					as: 'category_product',
					attributes: ['ptcat_desc']
				},
				{
					model: InvcMstr,
					as: 'Qty',
					attributes: ['invc_qty_available'],
					where:{
						[Op.or]: [
							{
								invc_loc_id: {
									[Op.eq]: 10001
								},
							},{
								invc_loc_id: {
									[Op.eq]: 300018
								},
							},{
								invc_loc_id: {
									[Op.eq]: 200010
								}
							}
						],
					},
					required: false
				}
			],
			raw: true,
			nest: true,
			distinct: true
		}).then(results => {
			for (const result of results.rows) {
				if (result.Qty.invc_qty_available == null) {
					result.Qty.invc_qty_available = '0.00000000'
				}

				if (result.category_product.ptcat_desc == null) {
					result.category_product.ptcat_desc = '-'
				}

				if (result.pt_cat_id == null) {
					result.pt_cat_id = '-'
				}
			}

			let data = {
				product: results.rows,
				page: page,
				totalData: results.rows.length,
				totalPage: Math.ceil(results.count / limit)
			}

			res.status(200)
				.json({
					status: 'berhasil',
					message: 'berhasil mengambil data produk',
					data: data
				})
		}).catch(err => {
			res.status(400)
				.json({
					status: 'gagal',
					message: 'gagal mengambil data produk',
					error: err.message
				})
		})
	}

	getGrade = (req, res) => {
		PtMstr.findAll({
			attributes: [
				[Sequelize.literal(`distinct pt_class`), 'grade']
			],
			where: {
				pt_class: {
					[Op.not]: null
				}
			}
		})
		.then(result => {
			res.status(200)
				.json({
					status: 'sucess!',
					data: result,
					error: null
				})
		})
		.catch(err => {
			res.status(400)
				.josn({
					status: 'failed!',
					data: null,
					error: err.message
				})
		})
	}
}

module.exports = new ProductController()