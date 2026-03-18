import { useState } from 'react';
import { getWeatherByCity } from '../services/weatherApi';
import '../App.css';

export default function WeatherDashboard() {
  const [cityInput, setCityInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!cityInput.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const data = await getWeatherByCity(cityInput.trim());
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get current location weather
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`
          );

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data?.message || "Failed to fetch location weather");
          }

          setWeatherData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location access denied");
        setLoading(false);
      }
    );
  };

  return (
    <div className="weather-container">
      <h2 style={{ marginTop: 0 }}>Weather Forecast</h2>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder="Enter city name..."
          className="search-input"
          autoFocus
        />
        <button type="submit" disabled={loading} className="search-button">
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>

      {/* Current Location Button */}
      <button onClick={handleCurrentLocation} className="search-button" style={{ marginBottom: '15px' }}>
        Use My Location 📍
      </button>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {weatherData && !loading && !error && (
        <div className="weather-data">
          <h3>
            {weatherData?.name}, {weatherData?.sys?.country}
          </h3>

          <img
            className="weather-icon"
            src={`https://openweathermap.org/img/wn/${weatherData?.weather?.[0]?.icon}@4x.png`}
            alt={weatherData?.weather?.[0]?.description}
          />

          <div className="temperature">
            {Math.round(weatherData?.main?.temp)}°C
          </div>

          <p style={{ textTransform: 'capitalize' }}>
            {weatherData?.weather?.[0]?.description}
          </p>

          <div className="details">
            <div className="detail-item">
              <span className="detail-label">Humidity</span>
              <span className="detail-value">
                {weatherData?.main?.humidity}%
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Wind</span>
              <span className="detail-value">
                {weatherData?.wind?.speed} m/s
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}