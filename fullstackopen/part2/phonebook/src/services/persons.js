import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

// Récupère toutes les personnes (HTTP GET)
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

// Crée une nouvelle personne (HTTP POST)
const create = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then((response) => response.data)
}

// Supprime une personne existante (HTTP DELETE)
const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then((response) => response.data)
}

// Met à jour une personne existante (HTTP PUT)
const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then((response) => response.data)
}

export default { getAll, create, remove, update }