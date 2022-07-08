const User = require('../models/user')

const authenticateRoute = (req, res, next) => {
    // Grab the token from the request header
    const token = req.header('x-auth')
    try {
        User.findByToken(token).then((user) => {
            if (!user) {
                return Promise.reject()
            }
            req.user = user
            req.token = token

            next()
        }).catch((e) => {
            res.send({
                success: false,
                error: "Authentication failed"
            })

        });
    } catch (e) {
        res.send({
            success: false,
            error: "Authentication failed"
        })
    }
}

module.exports = authenticateRoute