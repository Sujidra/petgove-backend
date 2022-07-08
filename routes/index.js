const express = require("express")
const app = express()


app.use('/auth', require("./auth.routes.js"))


module.exports = app
