require('dotenv').config()
const axios = require('axios')
const os = require('node:os')
const request_ip = require('request-ip')
const ip = require('ip')
const jwt = require('jsonwebtoken')


let testMiddleware = async (req, res, next) => {    
    // middleware
    let authHeader = req.headers['authorization']

    console.log(req.headers)

    next()
}

module.exports = testMiddleware