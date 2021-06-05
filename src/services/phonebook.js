import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/persons/'

const getAll = () => {
	const request = axios.get(baseUrl)
	return request.then(response => response.data)
}

const createPerson = newObject => {
	const request = axios.post(baseUrl, newObject)
	return request.then(response => response.data)
}

const deletePerson = PersonId => {
	const request = axios.delete(baseUrl+PersonId)
	return request.then(response => response.data)
}

const updatePerson = updatedObject => {
	const request = axios.put(baseUrl+updatedObject.id, updatedObject)
	return request.then(response => response.data)
}

const phonebook = {
	getAll,
	createPerson,
	deletePerson,
	updatePerson
}

export default phonebook;