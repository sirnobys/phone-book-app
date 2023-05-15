const mongoose = require('mongoose')

const contactSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "enter first name"]
    },
    last_name: {
        type: String,
        required: [true, "enter last name"]
    },
    number: {
        type: String,
        required: true
    },
    // timestamp: true
})

const Contact = mongoose.model('Contact', contactSchema)

module.exports = Contact