const axios = require('axios')
const os = require('node:os')
const request_ip = require('request-ip')
const ip = require('ip')


let testMiddleware = async (req, res, next) => {    
    // middleware

    next()
}

module.exports = testMiddleware