const express = require('express')
var morgan = require('morgan')
const app = express()
const mongoose = require('mongoose')
const Contact = require('./models/person')
require('dotenv').config()
app.use(express.json())
app.use(express.static('dist'))

morgan.token("body", (req) => {
    return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (request, response) => {
    response.send(
        `<div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p> ${new Date()}
        </div>`
    )
})

app.get('/api/persons', (request, response) => {
    Contact.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Contact.findById(request.params.id)
        .then(person => {
            if (person) {
                response
                    .json(person)
            } else {
                response
                    .status(404).end()
            }
        })
        .catch(error => {
            console.log('Error', error.message)
            response
                .status(500)
                .send({ error: 'Malformatted id' })
        })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Contact.findByIdAndDelete(id)


    const selectedPerson = persons.find(person => person.id === id)
    console.log(selectedPerson)
    if (selectedPerson) {
        persons = persons.filter(person => person.id !== id)
        response.status(204).json({ message: 'Success' })
    }
    else {
        response.status(404).json({ error: 'Not Found' })
    }
})
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        response
            .status(400)
            .json({ error: 'name or number is missing' })
    } else {
        Contact.findOne({ name: body.name }).then(person => {
            if (person) {
                response.status(409).json({
                    message: "Name must be unique"
                })
            } else {

                const newPerson = new Contact({
                    name: body.name,
                    number: body.number,
                })

                newPerson.save().then(person => {
                    response.json(newPerson)
                })

            }
        })
    }
})
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})



