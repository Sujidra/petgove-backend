/* NPM IMPORTS */
const express = require("express")
const router = express.Router()

/* MIDDLEWARES */
const authenticateRoute = require('../middleware')

// CONTROLLER FUNCTIONS
const {
    registerUser,
    loginUser,
    getMe,
    logoutUser
} = require('../controllers/auth/index');



/* REGISTER ROUTE */
router.post(
    '/register',
    registerUser
)


router.post('/login', loginUser)
router.delete('/logout', authenticateRoute, logoutUser)
router.get('/currentUser', authenticateRoute, getMe)

module.exports = router


