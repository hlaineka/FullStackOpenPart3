import React, { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'
import './index.css'

const PersonsToShow = (persons, filterstr) => (
  persons.filter(obj => obj.name.toLowerCase().includes(filterstr.toLowerCase())))

const Person = ({person, delPerson}) => (
    <p>{person.name} {person.number} <button onClick={(event) => delPerson(event, person.id)}>delete</button></p>)

const NumberList = ({persons, filterstr, delPerson}) => (
    PersonsToShow(persons, filterstr).map((person) => (
      <Person person={person} delPerson={delPerson} key={person.name}/>
    )))

const FilterForm = ({newFilter, handleFilter}) => (
  <div>filter shown with <input value={newFilter} onChange={handleFilter}/></div>
)

const PersonForm = ({addPerson, newName, handleNameChange, newNumber, handleNumberChange}) => (
  <form onSubmit={addPerson}>
    <div>name: <input value={newName} onChange={handleNameChange}/></div>
    <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Notification = ({message}) => {
  if (message === null) {
    return null
  }
  return (
  <div className="info box">{message}</div>)
}

const Error = ({message}) => {
  if (message === null) {
    return null
  }
  return (
    <div className="error box">{message}</div>
  )
}

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setFilter ] = useState('')
  const [ infoMessage, setInfoMessage ] = useState(null)
  const [ errorMessage, setErrorMessage ] = useState(null)

  useEffect(() => {
    phonebookService
      .getAll()
        .then(initialPersons => {
        setPersons(initialPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (-1 === persons.findIndex(obj => obj.name === newName)){
      const personObject = {
        name: newName,
        number: newNumber,
      }
      phonebookService
        .createPerson(personObject)
          .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setInfoMessage(`${newName} added to phonebook`)
          setTimeout(() => {
            setInfoMessage(null)
          }, 5000)
        })
    }
    else if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
      const updatePerson = persons.find(obj => obj.name === newName)
      const updatedPerson = {...updatePerson, number: newNumber}
      phonebookService
        .updatePerson(updatedPerson)
          .then(() => {
            phonebookService.getAll().then(newPersons => {setPersons(newPersons)})
            setInfoMessage(`${newName}'s number updated`)
            setTimeout(() => {
              setInfoMessage(null)
            }, 5000)
          })
    }
    setNewName('')
    setNewNumber('')
    setFilter('')
  }

  const delPerson = (event, id) => {
    event.preventDefault()
    const toDelete = persons.find((obj) => obj.id===id)
    if (window.confirm("Delete " + toDelete.name)){
      phonebookService
        .deletePerson(toDelete.id)
          .then(() => {
            phonebookService.getAll().then(newPersons => {setPersons(newPersons)})
            setInfoMessage(`${toDelete.name} deleted`)
            setTimeout(() => {
              setInfoMessage(null)
            }, 5000)
          })
          .catch(error => {
            setErrorMessage(`Information of ${toDelete.name} has already been removed from server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.filter(n => n.id !== id))
          })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <Notification message={infoMessage}/>
      <Error message={errorMessage}/>
      <h1>Phonebook</h1>
      <FilterForm newFilter={newFilter} handleFilter={handleFilter}/>
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <NumberList persons={persons} filterstr={newFilter} delPerson={delPerson}/>
    </div>
  )
}

export default App
