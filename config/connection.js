var {Sequelize} = require('sequelize')
var rawSequelize = new Sequelize(
    'exapro_mutif_02052021_produksi',
    'postgres',
    'bangkar',
    {
        host: '192.168.7.121',
        port: '5432',
        dialect: 'postgres'
    }
    )

module.exports = rawSequelize