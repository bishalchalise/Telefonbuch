const mongoose = require('mongoose')
require('dotenv').config()


mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url, { family: 4 })
    .then(result => console.log('connected to database.....'))
    .catch(error => console.log('error connecting to database....', error.message))

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
    },
    number: String,
})


contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)
