/* NPM IMPORTS */
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

/* CUSTOM IMPORTS */
const { mongoose, db } = require('./db')


const app = express()


/* BODY PARSER */
app.use(bodyParser.json())

app.use(cors({ credentials: true, exposedHeaders: ['x-auth', 'X-RateLimit-Reset'] }))



/* HOME ROUTE */
app.get('/', (req, res) => {
    res.send('pet gove server')
})

/* ROOT ROUTE */
app.use("/petgove/api", require("./routes"))


app.all('*', async (req, res, next) => {
    try {
        res.send('Route not found')
    } catch (e) {
        next(e)
    }
})

/* LISTEN */
app.listen(8080, async () => {
    console.log(`Listening on port ${8080}`)
})  
