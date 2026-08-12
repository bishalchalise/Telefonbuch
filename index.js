const express = require('express')
var morgan = require('morgan')
const app = express()
const mongoose = require('mongoose')
const Contact = require('./models/person')
require('dotenv').config()
app.use(express.json())
app.use(express.static('dist'))

//morgan log
morgan.token("body", (req) => {
    return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

//get info
app.get('/info', (request, response, next) => {

    Contact.countDocuments()
        .then(count => {
            response.send(
                `<div>
                     <p>Phonebook has info for ${count} people</p>
                      <p> ${new Date()}
                 </div>`
            )
        })
        .catch(error => next(error));
})

//get all

app.get('/api/persons', (request, response) => {
    Contact.find({}).then(persons => {
        response.json(persons)
    })
})

//get by id
app.get('/api/persons/:id', (request, response, next) => {
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
        .catch(error => next(error))
})

//delete method 

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Contact.findByIdAndDelete(id).then(result => {
        response.status(204).end()
    }).catch(error => next(error))
})

//post method
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response
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
                }).catch(error => next(error))

            }
        }).catch(error => next(error))
    }
})

//put/edit method

app.put('/api/persons/:id', (request, response, next) => {
    Contact.findById(request.params.id)
        .then(
            person => {
                if (!person) {
                    return response.status(404).end()
                }
                person.name = request.body.name
                person.number = request.body.number

                person.save().then((updatedPerson) => {
                    response.json(updatedPerson)
                })
            })
        .catch(error => next(error))
})

//unknown endpoint
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

//error handler
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })

    }

    next(error)
}
// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})



