/* NPM IMPORTS */
const validator = require('validator')
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');


let JWT_SECRET = "videoplayer"


const UserSchema = new Schema({

    email: {
        type: String,
        minlength: 1,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        },
        required: [true, 'Email required']
    },
    password: {
        type: String,
        required: [true, 'Password required'],
        minlength: [6, 'Minimum password length is 6 characters'],
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain the word password')
            }
        }
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true,
            validator: validator.isJWT
        }
    }]
})



UserSchema.pre("save", function (next) {
    let user = this
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})


UserSchema.methods.getAuthFields = function () {
    let returnObject = {
        _id: this._id,
        email: this.email,
        username: this.username,
    }
    return returnObject
}


UserSchema.methods.generateAuthToken = async function (cb) {
    const user = this

    let access = 'auth';
    let token = jwt.sign({ _id: user._id.toHexString(), access }, JWT_SECRET, { expiresIn: "7 days" }).toString()

    let obj = {
        access,
        token
    }

    user.tokens.push(obj)

    await user.save()
    // cb(token)
    return token
}


UserSchema.methods.removeToken = function (token) {
    let user = this;
    return user.update({
        $pull: {
            tokens: { token }
        }
    })
}


// SCHEMA METHODS

UserSchema.statics.findByToken = function (token) {
    let Users = this;
    let decoded;

    try {
        decoded = jwt.verify(token, JWT_SECRET)
    } catch (e) {
        return Promise.reject()
    }

    return Users.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })

};


UserSchema.statics.findByCredentials = async function (email, password) {
    let User = this;

    let existingUser = await User.findOne({ email })

    if (!existingUser) throw new Error('User not found')

    if (!existingUser.password) throw new Error('Invalid credentials')

    let isMatch = await bcrypt.compare(password, existingUser.password)

    if (!isMatch) throw new Error('Password incorrect')

    return existingUser
}



let User = mongoose.model('user', UserSchema)
module.exports = User


