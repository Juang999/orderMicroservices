const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('exapro_mutif_23042023_produksi', 'mutifserver', 'MutifServer123@#', {
    host: '203.175.10.171',
    port: '5433',
    dialect: 'postgres'
})

module.exports = sequelize