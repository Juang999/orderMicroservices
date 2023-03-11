const express = require('express')
const router = express.Router()
const middleware = require('../app/kernel')

router.get('/findProduct', [middleware.authenticate])