import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    countryService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
      .catch(error => {
        console.error('Erreur lors du chargement des pays:', error)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const filteredCountries = search.trim() === '' 
    ? [] 
    : countries.filter(country => 
        country.name.common.toLowerCase().includes(search.toLowerCase())
      )

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <div>
        find countries <input value={search} onChange={handleSearchChange} />
      </div>

      <div style={{ marginTop: '20px' }}>
        <Content countries={filteredCountries} />
      </div>
    </div>
  )
}

const Content = ({ countries }) => {
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    setSelectedCountry(null)
  }, [countries])

  if (selectedCountry) {
    return (
      <div>
        <CountryDetail country={selectedCountry} />
        <button 
          style={{ marginTop: '10px' }} 
          onClick={() => setSelectedCountry(null)}
        >
          back to list
        </button>
      </div>
    )
  }

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length > 1) {
    return (
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {countries.map(country => (
          <li key={country.cca3 || country.name.common} style={{ marginBottom: '8px' }}>
            {country.name.common}{' '}
            <button onClick={() => setSelectedCountry(country)}>
              show
            </button>
          </li>
        ))}
      </ul>
    )
  }

  if (countries.length === 1) {
    return <CountryDetail country={countries[0]} />
  }

  return null
}

const CountryDetail = ({ country }) => {
  const [weather, setWeather] = useState(null)
  
  // Récupération de la clé d'environnement Vite
  const apiKey = import.meta.env.VITE_WEATHER_KEY
  const capital = country.capital ? country.capital[0] : null

  useEffect(() => {
    if (capital && apiKey) {
      weatherService
        .getWeather(capital, apiKey)
        .then(data => {
          setWeather(data)
        })
        .catch(error => {
          console.error('Erreur lors de la récupération de la météo:', error)
        })
    }
  }, [capital, apiKey])

  const languages = country.languages ? Object.values(country.languages) : []
  const flagUrl = country.flags?.png || country.flags?.svg

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {capital || 'N/A'}</p>
      <p>area {country.area}</p>

      <h3>languages:</h3>
      <ul>
        {languages.map((lang, index) => (
          <li key={index}>{lang}</li>
        ))}
      </ul>

      {flagUrl && (
        <img 
          src={flagUrl} 
          alt={`Flag of ${country.name.common}`} 
          style={{ width: '150px', marginTop: '10px', border: '1px solid #ccc' }} 
        />
      )}

      {weather && (
        <div style={{ marginTop: '20px' }}>
          <h2>Weather in {capital}</h2>
          <p>temperature {weather.main.temp} Celsius</p>
          {weather.weather[0] && (
            <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
              alt={weather.weather[0].description} 
            />
          )}
          <p>wind {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}

export default App