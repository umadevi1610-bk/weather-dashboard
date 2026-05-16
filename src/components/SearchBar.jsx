import { useState } from 'react'

function SearchBar({ fetchWeather }) {
  const [city, setCity] = useState('')

  const handleSearch = () => {
    if (city.trim() !== '') {
      fetchWeather(city)
    }
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch()
          }
        }}
      />

      <button onClick={handleSearch}>Search</button>
    </div>
  )
}

export default SearchBar