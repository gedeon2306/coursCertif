import axios from 'axios'

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

// Récupère la météo pour une ville donnée (en Celsius avec units=metric)
const getWeather = (city, apiKey) => {
  const request = axios.get(`${baseUrl}?q=${city}&units=metric&appid=${apiKey}`)
  return request.then(response => response.data)
}

export default { getWeather }