let posMiddleware = (req, res, next) => {
    let authHeader = req.headers['authorization']

    let token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        res.status(300)
            .json({
                code: 300,
                status: 'unauthorize',
                error: 'unauthorize',
            })
        
        return
    }

    let decryptedToken = atob(token)

    if (decryptedToken != '$.POS-App123@#.$') {
        res.status(300)
            .json({
                code: 300,
                status: 'unauthorize',
                message: 'unauthorize'
            })

        return
    }

    next()
}

module.exports = posMiddleware