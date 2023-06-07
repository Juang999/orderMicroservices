const {check, validationResult} = require('express-validator')

const rules = [
    check('visit_code').notEmpty().isString(),
    check('checkin_lat').notEmpty().isNumeric(),
    check('checkin_long').notEmpty().isNumeric(),
    check('checkin_address').notEmpty().isString(),
    check('objective').notEmpty().isNumeric(),
]

const CheckinRequest = [
    // rules
    rules,
    // middleware
    (req, res, next) => {
        const errors = validationResult(req)
        
        if (!errors.isEmpty()) {
            res.status(422)
                .json(errors.array())
        
            return
        }

        next()
    }
]

module.exports = CheckinRequest