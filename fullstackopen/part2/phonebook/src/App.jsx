import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  // Gère la saisie dans le champ de texte
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  // Gère l'ajout d'une nouvelle personne lors de la soumission du formulaire
  const addPerson = (event) => {
    event.preventDefault() // Empêche le rechargement de la page
    
    const personObject = {
      name: newName
    }

    // Ajoute la nouvelle personne sans muter le tableau d'état d'origine
    setPersons(persons.concat(personObject))
    setNewName('') // Réinitialise le champ de saisie
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((person) => (
        <p key={person.name}>{person.name}</p>
      ))}
    </div>
  )
}

export default App