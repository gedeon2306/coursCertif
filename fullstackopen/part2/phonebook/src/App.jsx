import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const Filter = ({ value, onChange }) => (
  <div>
    filter shown with <input value={value} onChange={onChange} />
  </div>
)

const PersonForm = ({
  onSubmit,
  nameValue,
  onNameChange,
  phoneValue,
  onPhoneChange
}) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={nameValue} onChange={onNameChange} />
    </div>
    <div>
      number: <input value={phoneValue} onChange={onPhoneChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ list, onDelete }) => (
  <div>
    {list.map((entry) => (
      <p key={entry.id}>
        {entry.name} {entry.number}{' '}
        <button onClick={() => onDelete(entry.id, entry.name)}>
          delete
        </button>
      </p>
    ))}
  </div>
)

const App = () => {
  const [contacts, setContacts] = useState([])
  const [nameInput, setNameInput] = useState('')
  const [phoneInput, setPhoneInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Regroupement de l'état de notification sous un seul objet
  const [banner, setBanner] = useState({ text: null, type: 'success' })

  useEffect(() => {
    personService.getAll().then((data) => {
      setContacts(data)
    })
  }, [])

  const displayNotification = (text, type = 'success') => {
    setBanner({ text, type })
    setTimeout(() => {
      setBanner({ text: null, type: 'success' })
    }, 5000)
  }

  const resetFormFields = () => {
    setNameInput('')
    setPhoneInput('')
  }

  // Traitement d'une mise à jour de numéro (PUT)
  const updateExistingContact = (existingContact) => {
    const confirmation = window.confirm(
      `${existingContact.name} is already added to phonebook, replace the old number with a new one?`
    )

    if (!confirmation) return

    const updatedContact = { ...existingContact, number: phoneInput }

    personService
      .update(existingContact.id, updatedContact)
      .then((savedData) => {
        setContacts(
          contacts.map((c) => (c.id !== existingContact.id ? c : savedData))
        )
        resetFormFields()
        displayNotification(`Updated number for ${savedData.name}`)
      })
      .catch(() => {
        displayNotification(
          `Information of '${existingContact.name}' has already been removed from server`,
          'error'
        )
        setContacts(contacts.filter((c) => c.id !== existingContact.id))
      })
  }

  // Traitement d'un ajout standard (POST)
  const createNewContact = () => {
    const newEntry = { name: nameInput, number: phoneInput }

    personService
      .create(newEntry)
      .then((createdEntry) => {
        setContacts(contacts.concat(createdEntry))
        resetFormFields()
        displayNotification(`Added ${createdEntry.name}`)
      })
      .catch(() => {
        displayNotification(`Failed to add ${newEntry.name}`, 'error')
      })
  }

  const savePerson = (event) => {
    event.preventDefault()

    const targetName = nameInput.trim().toLowerCase()
    const duplicate = contacts.find((c) => c.name.toLowerCase() === targetName)

    if (duplicate) {
      updateExistingContact(duplicate)
    } else {
      createNewContact()
    }
  }

  const handleRemovePerson = (id, name) => {
    if (!window.confirm(`Delete ${name} ?`)) return

    personService
      .remove(id)
      .then(() => {
        setContacts(contacts.filter((c) => c.id !== id))
        displayNotification(`Deleted ${name}`)
      })
      .catch(() => {
        displayNotification(
          `Information of '${name}' has already been removed from server`,
          'error'
        )
        setContacts(contacts.filter((c) => c.id !== id))
      })
  }

  const visibleContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={banner.text} type={banner.type} />

      <Filter
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <h3>Add a new</h3>

      <PersonForm
        onSubmit={savePerson}
        nameValue={nameInput}
        onNameChange={(e) => setNameInput(e.target.value)}
        phoneValue={phoneInput}
        onPhoneChange={(e) => setPhoneInput(e.target.value)}
      />

      <h3>Numbers</h3>

      <Persons list={visibleContacts} onDelete={handleRemovePerson} />
    </div>
  )
}

export default App