const mongoose = require('mongoose')
const MONGO_URI = "mongodb://localhost:27017/video-player"


const option = {
    useNewUrlParser: true,

}

//mongoose.promise = global.promise
mongoose.Promise = global.Promise

mongoose.connect(MONGO_URI, option).then((conn) => {
    console.log('Connected to database')
})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'Connection Error:'))

module.exports = { mongoose, db }