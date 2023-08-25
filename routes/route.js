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
                        index_and_create: '/visitation',
                        visitation_type: '/visitation/type',
                        visitation_sales: '/visitation/sales',
                        visitation: '/visitation/:ptnr_id/sales',
                        visitation_periode: '/visitation/periode',
                        visitation_goal: '/visitation/:userid/goal',
                        visitation_customer: '/visitation/customer',
                        visitation_code: '/visitation/:userid/code',
                        visitation_visit_customer: '/visitation/visit',
                        visitation_create_periode: '/visitation/periode',
                        visitation_detail: '/visitation/:visited_oid/detail',
                        visitation_output: '/visitation/:user_ptnr_id/output',
                        visitation_schedule: '/visitation/:visit_code/schedule',
                        visitation_checkin: '/visitation/:user_ptnr_id/checkin',
                        visitation_sales_quotation: '/visitation/:user_ptnr_id/sales-quotation',
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
                        visitation_index: '/visitation',
                        visitation_type: '/visitation/type',
                        visitation_output: '/visitation/output',
                        visitation_create_schedule: '/visitation',
                        visitation_input_custoer: '/visitation/customer',
                        visitation_sales_periode: '/visitation/:periode/sales',
                        visitation_customer: '/visitation/customer/per-periode',
                        visitation_check_in: '/visitation/:visited_oid/checkin',
                        visitation_check_out: '/visitation/:visited_oid/checkout',
                        visitation_delete_schedule: '/visitation/:visit_code/delete',
                        visitation_detail: '/visitation/:visited_oid/visitation_detail',
                        visitation_schedule: '/visitation/:visit_code/visitation_schedule',
                        visitation_delete_customer: '/visitation/customer/:visited_oid/delete',
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
                        sq_create_sales_quotation: '/create-sales-quotation', 
                        // data support
                        sq_site: '/get-site', 
                        sq_area: '/get-area', 
                        sq_location: '/location/:en_id', 
                        sq_unit_measure: '/get-unitmeasure', 
                        sq_get_sales_quotation: '/get-sales-quotation', 
                        sq_total_debt: '/sum-debt-from-customer/ptnrid/:ptnrId', 
                        sq_credit_limit: '/get-credit-limit-customer/ptnrid/:ptnrId', 
                        sq_price_list_by_group: '/get-price-list/partnergroupid/:partnerGroupId', 
                        sq_product_by_price: '/get-product/pricelist/:pricelistOid/area/:areaId/locationid/:locId', 
                    },
                    auth: {
                        login: '/login',
                        profile: '/profile',
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