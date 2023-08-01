const kernel = {
    authenticate: require('./Middleware/authenticate'),
    CheckinRequest: require('./Middleware/requests/CheckinRequest'),
    CheckoutRequest: require('./Middleware/requests/CheckoutRequest'),
    adminAuthenticate: require('./Middleware/admin-authenticate')
}

module.exports = kernel