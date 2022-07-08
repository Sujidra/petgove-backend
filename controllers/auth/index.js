const pick = require('lodash.pick')
const jwt = require('jsonwebtoken');

const User = require('../../models/user')



const registerUser = async (req, res, next) => {
    try {
        // console.log("On Register",Date.now(),req.body);
        let { email, password } = pick(req.body, ['email', 'password'])


        const existingUser = await User.findOne({ email: email })

        if (existingUser) {
            throw new Error('Email in use')
        }

        /* Creating a new user */
        let newUser = new User({
            email: email,
            password: password

        })

        await newUser.save()



        /* Generating a new auth token for the user */
        let token = await newUser.generateAuthToken();

        newUser = newUser.getAuthFields()

        res.header({ 'x-auth': token }).send({
            success: true,
            message: 'Successfully registered user'
        })

    } catch (e) {
        res.send({
            success: false,
            error: e.message
        })
    }
}


const loginUser = async (req, res, next) => {
    try {

        let { email, password } = pick(req.body, ['email', 'password'])


        let user = await User.findByCredentials(email, password)

        /* Generate a token  */
        const token = await user.generateAuthToken();

        res.header('x-auth', token).send({
            success: true,
            token: token
        })

    } catch (e) {
        res.send({
            success: false,
            error: e.message
        })
    }
}

const getMe = async (req, res, next) => {
    try {
        let user = req.user

        const responseUser = {
            _id: user._id,
            email: user.email,
            username: user.username,
        };



        res.status(200).send({ success: true, user: responseUser })

    } catch (e) {
        res.send({
            success: false,
            error: e.message
        })
    }
}


const logoutUser = async (req, res, next) => {
    try {
        await req.user.removeToken(req.token)
        res.status(200).send({ success: true, message: 'Successfully logged out' });
    } catch (e) {
        res.send({
            success: false,
            error: "Already logged out"
        })
    }
}


module.exports = {
    registerUser,
    loginUser,
    getMe,
    logoutUser
}

