import { useState } from 'react'
import './styles/app.css'
import SearchBar from './components/SearchBar'

function App() {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])

  const fetchWeather = async (city) => {
    try {
      setLoading(true)
      setError('')

      await new Promise((resolve) => setTimeout(resolve, 1500))

      const apiKey = import.meta.env.VITE_API_KEY

      // Current Weather
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      )

      const data = await response.json()

      if (data.cod === 200) {
        setWeather(data)

        // Search History
        setHistory((prev) => {
          const updated = [city, ...prev.filter((item) => item !== city)]
          return updated.slice(0, 5)
        })

        // Forecast API
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        )

        const forecastData = await forecastResponse.json()

        const daily = forecastData.list.filter(item =>
              item.dt_txt.includes("12:00:00")
              ).slice(0, 5)
        setForecast(daily)
      } else {
        setError('City not found')
        setWeather(null)
      }
    } catch (error) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const weatherCondition = weather?.weather?.[0]?.main || ''

  const getBackground = () => {
    switch (weatherCondition) {
      case 'Clear':
        return 'clear'

      case 'Clouds':
        return 'clouds'

      case 'Rain':
      case 'Drizzle':
        return 'rain'

      case 'Thunderstorm':
        return 'storm'

      case 'Snow':
        return 'snow'

      default:
        return ''
    }
  }

  return (
    <div className={`app ${getBackground()}`}>
      <div className="weather-container">
        <h1>Weather Dashboard</h1>

        <SearchBar fetchWeather={fetchWeather} />

        {/* Search History */}
        <div className="history">
          {history.map((item, index) => (
            <button
              key={index}
              className="history-btn"
              onClick={() => fetchWeather(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && <p className="loading">Loading...</p>}

        {/* Error */}
        {error && <p className="error">{error}</p>}

        {/* Weather Info */}
        {weather && weather.main && (
          <div className="weather-info">
            <h2>{weather.name}</h2>

            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather icon"
            />

            <h3>{Math.round(weather.main.temp)}°C</h3>

            <p>{weather.weather[0].main}</p>

            <p>Humidity: {weather.main.humidity}%</p>

            <p>Wind: {weather.wind.speed} km/h</p>
          </div>
        )}

        {/* Forecast */}
        {forecast.length > 0 && (
          <div className="forecast">
            <h3>5-Day Forecast</h3>

            <div className="forecast-list">
              {forecast.map((item, index) => (
                <div key={index} className="forecast-card">
                  <p>{new Date(item.dt_txt).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                    alt=""
                  />

                  <p>{Math.round(item.main.temp)}°C</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App