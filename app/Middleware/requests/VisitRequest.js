const {check, validationResult} = require('express-validator')

const rules = [
    check('visit_code').notEmpty().isString()
]

const VisitRequest = [
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

module.exports = VisitRequest