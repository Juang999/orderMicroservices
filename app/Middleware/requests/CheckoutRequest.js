const {check, validationResult} = require('express-validator')

const rules = [
    check('visit_code').notEmpty().isString(),
    check('checkout_lat').notEmpty().isNumeric(),
    check('checkout_long').notEmpty().isNumeric(),
    check('checkout_address').notEmpty().isString(),
    check('result').notEmpty().isString(),
    check('output').notEmpty().isNumeric()
]

const CheckoutRequest = [
    // rules
    rules,
    //validation
    (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            res.status(400)
                .json(errors.array())
        
            return
        }

        next()
    }
]

module.exports = CheckoutRequest