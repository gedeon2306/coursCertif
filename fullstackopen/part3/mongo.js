const mongoose = require('mongoose')

// Vérification de la présence du mot de passe dans process.argv
if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

// Récupération des arguments transmis en ligne de commande
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

// Construction de l'URI de connexion avec le mot de passe
const url = `mongodb+srv://fullstackopen:${password}@cluster0.fvrn9j6.mongodb.net/?appName=phonebookApp`


// Définition du schéma et du modèle Mongoose
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose
.connect(url)
.then((result) => {
    // CAS 1 : Seul le mot de passe est fourni -> Afficher tous les contacts
    if (process.argv.length === 3) {
      Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
    }

    // CAS 2 : Mot de passe, nom et numéro sont fournis -> Ajouter un contact
    if (process.argv.length >= 5) {
      const person = new Person({
        name: name,
        number: number,
      })

      person.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
      })
    }
 })
 .then(() => {
   return mongoose.connection.close()
 })
 .catch((err) => console.log(err))