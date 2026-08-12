const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://NoteApp:${password}@cluster0.lf2nkzo.mongodb.net/phonebook?appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

const person = new Contact({
    name: process.argv[3],
    number: process.argv[4],
})



if (process.argv.length > 4) {
    person.save().then(result => {
        console.log('added', person)
        mongoose.connection.close()
    })
} else {
    Contact.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}


