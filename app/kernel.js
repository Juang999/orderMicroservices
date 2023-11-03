class Kernel {
    constructor () {
        return {
            authenticate: require('./Middleware/authenticate'),
            posAuthenticate: require('./Middleware/pos-authentication'),
            adminAuthenticate: require('./Middleware/admin-authenticate'),
            CheckinRequest: require('./Middleware/requests/CheckinRequest'),
            CheckoutRequest: require('./Middleware/requests/CheckoutRequest'),
        }
    }
}

module.exports = new Kernel()