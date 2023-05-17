const kernel = {
    authenticate: require('./Middleware/authenticate'),
    VisitRequest: require('./Middleware/requests/VisitRequest')
}

module.exports = kernel