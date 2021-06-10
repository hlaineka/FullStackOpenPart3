require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

const morgan = require('morgan')
morgan.token('reqBody', (req, res) => {
	if (req.method === "POST"){
		return JSON.stringify(req.body)
	}
	return ""
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))

const Person = require('./models/person')

app.get('/', (request, response) => {
	response.send('<h1>Hello World!</h1>')
})
  
app.get('/api/persons', (request, response) => {
	Person.find({}).then(persons => {
		response.json(persons)
})})

app.get('/info', (request, response) => {
	const currentTime = new Date();
	const info = 'Phonebook has info for ' + persons.length + ' people <br><br>' + currentTime.toString()
	response.send(info)
  })

  app.get('/api/persons/:id', (request, response) => {
	Person.findById(request.params.id).then(person => {
		response.json(person)
	})
  })

  app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter(person => person.id !== id)
	response.status(204).end()
  })

  app.post('/api/persons', (request, response) => {
	const body = request.body

	if (!body.name || !body.number){
		return response.status(400).json({error: "name or number missing"})
	}

	const newPerson = new Person({
		name: body.name,
		number: body.number
	})

	newPerson.save().then(savedNote => {
		response.json(savedNote)
	})
  })

  
  const PORT = process.env.PORT
  app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
  })