const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length == 4) {
	console.log('give password, name and number as pasword')
	process.exit(1)
}

if (process.argv.length > 5) {
	console.log('too many parameters')
	process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://helvi:${password}@cluster0.gryrc.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const noteSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', noteSchema)

if (process.argv.length == 3)
{
	Person.find({}).then(result => {
		result.forEach(person => {
			console.log(person)
		})
	mongoose.connection.close()
})}

if (process.argv.length == 5)
{
	const person = new Person({
		name: process.argv[3],
		number: process.argv[4]
	})

person.save().then(response => {
  console.log('person saved!')
  mongoose.connection.close()
})}