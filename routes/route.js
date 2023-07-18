const route = {
    route_service: '/order-service',
    route_default: null,
    Admin: {
        route_admin: '/admin',
        feature: {
            visitation: {
                index: '/visitation',
                visitation: '/visitation/:ptnr_id/sales',
                visitation_schedule: '/visitation/:visit_code/schedule',
                visitation_detail: '/visitation/:visited_oid/detail'
            }
        }
    },
    Client: {
        route_client: '/client',
        feature: {
            partner: {
                partner_index: '/partner',
                partner_create: '/partner',
                partner_detail: '/partner/:ptnr_oid/detail',
            },
            partnerAddress: {
                address_create: '/partner-address',
                address_detail: '/partner-address/:ptnra_oid/detail',
            },
            partnerContactAddress: {
                contact_create: '/partner-contact',
                contact_detail: '/partner-contact/:ptnrac_oid/detail'
            },
            planning: {
                planning_index: '/planning',
                planning_create: '/planning',
                planning_detail: '/planning/:plans_oid/detail'
            },
            visitation: {
                visitation_index: '/visitation',
                visitation_schedule: '/visitation/:visit_code/visitation_schedule',
                visitation_detail: '/visitation/:visited_oid/visitation_detail',
                visitation_create_schedule: '/visitation',
                visitation_input_custoer: '/visitation/customer',
                visitation_check_in: '/visitation/:visited_oid/checkin',
                visitation_check_out: '/visitation/:visited_oid/checkout',
                visitation_delete_customer: '/visitation/customer/:visited_oid/delete',
                visitation_delete_schedule: '/visitation/:visit_code/delete',
                visitation_type: '/visitation/type',
                visitation_output: '/visitation/output',
                visitation_customer: '/visitation/customer/per-periode'
            },
            productKnowledge: {
                // nothing
            }
        }
    }
}

module.exports = route