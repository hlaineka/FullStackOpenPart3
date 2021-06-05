const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('reqBody', (req, res) => {
	if (req.method === "POST"){
		return JSON.stringify(req.body)
	}
	return ""
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))

let persons = [
	{
	  id: 1,
	  name: "Arto Hellas",
	  number: "040-123456"
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523"
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345"
	},
	{
		id: 4,
		name: "Mary Poppendick",
		number: "39-23-6423122"
	}
  ]

  const getIdNumber = () => {
	let biggest = 0;
	persons.forEach(element => {
		if (element.id > biggest)
			biggest = element.id;
		})
	return (biggest + 1)
  }

  app.get('/', (request, response) => {
	response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (request, response) => {
	response.json(persons)
  })

  app.get('/info', (request, response) => {
	const currentTime = new Date();
	const info = 'Phonebook has info for ' + persons.length + ' people <br><br>' + currentTime.toString()
	response.send(info)
  })

  app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const person = persons.find(person => person.id === id)
	if (person) {
		response.json(person)
	} else {
		response.status(404).end()
	}
  })

  app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter(person => person.id !== id)
	response.status(204).end()
  })

  app.post('/api/persons', (request, response) => {
	
	if (!request.body.name || !request.body.number){
		return response.status(400).json({
			error: "name or number missing"
		})
	}

	if (-1 < persons.findIndex(element => element.name === request.body.name)) {
		return response.status(400).json({
			error: "name must be unique"
		})
	}

	const newId = getIdNumber()
	newPerson = {
		id: newId,
		name: request.body.name,
		number: request.body.number
	}
	persons = persons.concat(newPerson)
	response.json(newPerson)
  })

  
  const PORT = process.enc.PORT || 3001
  app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
  })