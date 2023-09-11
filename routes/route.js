class Route {
    constructor () {
        return {
            route_service: '/order-service',
            route_default: null,
            logout: '/logout',
            Admin: {
                route_admin: '/admin',
                feature: {
                    visitation: {
                        index_and_create: '/',
                        visitation_type: '/type',
                        visitation_sales: '/sales',
                        visitation: '/:ptnr_id/sales',
                        visitation_periode: '/periode',
                        visitation_goal: '/:userid/goal',
                        visitation_customer: '/customer',
                        visitation_code: '/:userid/code',
                        visitation_visit_customer: '/visit',
                        visitation_create_periode: '/periode',
                        visitation_detail: '/:visited_oid/detail',
                        visitation_output: '/:user_ptnr_id/output',
                        visitation_schedule: '/:visit_code/schedule',
                        visitation_checkin: '/:user_ptnr_id/checkin',
                        visitation_sales_quotation: '/:user_ptnr_id/sales-quotation',
                    },
                    auth: {
                        admin_login: '/admin-login',
                        authenticate: '/authenticate',
                        profile_admin: '/admin-profile'
                    }
                }
            },
            Client: {
                route_client: '/client',
                feature: {
                    partner: {
                        partner_index_and_create: '/',
                        partner_detail: '/:ptnr_oid/detail',
                        partner_mitra: '/mitra',
                        partner_parent: '/parent',
                        partner_warehouse: '/warehouse'
                    },
                    partnerAddress: {
                        address_create: '/', //done
                        address_detail: '/:ptnra_oid/detail', //done
                    },
                    partnerContactAddress: {
                        contact_create: '/', //done
                        contact_detail: '/:ptnrac_oid/detail' //done
                    },
                    planning: {
                        planning_index_and_create: '/',
                        planning_detail: '/:plans_oid/detail'
                    },
                    visitation: {
                        visitation_type: '/type', //done
                        visitation_output: '/output', //done
                        visitation_index_and_create: '/', //done
                        visitation_input_customer: '/customer', //done
                        visitation_detail: '/:visited_oid/detail', //done
                        visitation_sales_periode: '/:periode/sales', //done
                        visitation_schedule: '/:visit_code/schedule', //done
                        visitation_check_in: '/:visited_oid/checkin', //done
                        visitation_check_out: '/:visited_oid/checkout', //done
                        visitation_delete_schedule: '/:visit_code/delete', //done
                        visitation_delete_customer: '/customer/:visited_oid/delete', //done
                    },
                    product: {
                        // product
                        product_index: '/',
                        product_by_location: '/location', //done
                        product_by_price_list: '/price-list', //done
                        product_detail_by_location: '/location/:pt_id/show', //done
                        product_detail_by_price_list: '/price-list/:pt_id/show', //done
                        // category & sub category
                        product_category: '/category', //done
                        product_sub_category: '/category/:cat_id/sub_category', //done
                       // data support
                        product_size: '/size', //done
                        product_grade: '/grade', //done
                        product_price_list: '/price', //done
                    },
                    sales_quotation: {
                        // create sq
                        sq_index_and_create: '/', 
                        // data support
                        sq_site: '/site', //done
                        sq_location: '/:en_id/location', //done
                        sq_unit_measure: '/unitmeasure', //done
                        sq_total_debt: '/partner/:ptnrId/debt', //done 
                        sq_credit_limit: '/partner/:ptnrId/limit-credit', //done
                        sq_price_list_by_group: '/price-list/:partnerGroupId/group', //done
                        sq_product_by_price: '/product/pricelist/:pricelistOid/area/:areaId/locationid/:locId', 
                    },
                    auth: {
                        login: '/login',
                        profile: '/profile',
                    },
                    report: {
                        report_total_so: '/so',
                        report_total_sq: '/sq'
                    },
                    pointofsales: {
                        pos_product_consigment: '/:warehouse_id/product-consigment'
                    }
                }
            },
            Default: {
                route_default: '/default',
                // feature: 
                master: {
                    master_group: '/group', //done
                    master_gender: '/gender', //done
                    master_entity: '/entity', //done
                    master_bp_type: '/bp_type', //done
                    master_periode: '/periode', //done
                    master_citizen: '/citizen', //done
                    master_currency: '/currency', //done
                    master_location: '/location', //done
                    master_addr_type: '/addr_type', //done
                    master_tax_invoice: '/tax_invoice', //done
                    master_blood_group: '/blood_group', //done
                    master_payment_type: '/payment-type', //done
                    master_contact_person: '/contact_person', //done
                    master_payment_method: '/payment-method', //done
                    master_credit_terms: '/creditterms-mstr', //done
                    master_default_periode: '/periode/default' //done
                }
            }
        }
    }
}

module.exports = new Route()