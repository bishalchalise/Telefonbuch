const express = require('express')
const cors = require('cors')
var morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173'
}))

morgan.token("body", (req) => {
    return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]
app.get('/info', (request, response) => {
    response.send(
        `<div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p> ${new Date()}
        </div>`
    )
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.send(person)
    } else {
        response.status(404).json({ error: 'Not Found' })
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
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

generateId = () => {
    const id = Math.random().toString(36).substring(2, 7);
    return String(id);
};
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        response
            .status(400)
            .json({ error: 'name or number is missing' })
    } else {
        const nameChecker = persons.some(
            (p) => p.name.toLowerCase() === body.name.toLowerCase()
        )

        if (nameChecker) {
            response
                .status(400)
                .json({ error: 'name must be unique' })
        } else {
            const newPerson = {
                "id": generateId(),
                "name": body.name,
                "number": body.number
            }
            persons = persons.concat(newPerson)
            response.json(newPerson)
        }
    }
})
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})



