class Helper {
    constructor () {
        return {
            auth: require('./auth'),
            sequelize: require('./sequelize'),
            page: require('./page'),
            links: require('./links'),
            Query: require('./Query')
        }
    }
}

module.exports = new Helper()