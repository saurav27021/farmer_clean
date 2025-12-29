import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to map WMO codes to Emojis & Descriptions
  const getWeatherInfo = (code) => {
    // Codes based on OpenMeteo WMO documentation
    switch (true) {
      case code === 0: return { emoji: '☀️', text: 'Clear Sky' };
      case code === 1: return { emoji: '🌤️', text: 'Mainly Clear' };
      case code === 2: return { emoji: '⛅', text: 'Partly Cloudy' };
      case code === 3: return { emoji: '☁️', text: 'Overcast' };
      case code >= 45 && code <= 48: return { emoji: '🌫️', text: 'Foggy' };
      case code >= 51 && code <= 55: return { emoji: '🌦️', text: 'Drizzle' };
      case code >= 56 && code <= 57: return { emoji: '🌨️', text: 'Freezing Drizzle' };
      case code >= 61 && code <= 65: return { emoji: '🌧️', text: 'Rain' };
      case code >= 66 && code <= 67: return { emoji: '🌨️', text: 'Freezing Rain' };
      case code >= 71 && code <= 77: return { emoji: '❄️', text: 'Snow' };
      case code >= 80 && code <= 82: return { emoji: '🌦️', text: 'Showers' };
      case code >= 85 && code <= 86: return { emoji: '❄️', text: 'Snow Showers' };
      case code >= 95 && code <= 99: return { emoji: '⛈️', text: 'Thunderstorm' };
      default: return { emoji: '🌡️', text: 'Unknown' };
    }
  };

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
        );

        const current = response.data.current;
        const { emoji, text } = getWeatherInfo(current.weather_code);

        setWeather({
          temp: Math.round(current.temperature_2m),
          condition: text,
          humidity: current.relative_humidity_2m,
          windSpeed: current.wind_speed_10m,
          icon: emoji
        });
        setLoading(false);
      } catch (err) {
        console.error("Weather fetch failed:", err);
        setError("Unable to load weather data");
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.warn("Location access denied or failed. Defaulting to New Delhi.");
          // Default to New Delhi if permission denied or error
          fetchWeather(28.6139, 77.2090);
        }
      );
    } else {
      // Fallback for browsers without geolocation
      fetchWeather(28.6139, 77.2090);
    }
  }, []);

  const getWeatherAdvice = () => {
    if (!weather) return '';
    if (weather.temp > 35) return 'Extreme heat - hydrate and shade crops if possible';
    if (weather.temp > 30) return 'High temperature - ensure adequate irrigation';
    if (weather.humidity > 80 && weather.temp > 25) return 'High heat & humidity - risk of fungal diseases';
    if (weather.windSpeed > 20) return 'Strong winds - secure loose structures';
    if (weather.condition.toLowerCase().includes('rain') || weather.condition.toLowerCase().includes('drizzle')) return 'Rainy - avoid spraying pesticides today';
    if (weather.condition.toLowerCase().includes('snow')) return 'Freezing conditions - protect frost-sensitive crops';

    return 'Good weather conditions for farming';
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ textAlign: 'center', color: '#d32f2f' }}>
        <p>⚠️ {error}</p>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--white)' }}>
          {weather.icon} Weather
        </h3>
        <span style={{ fontSize: '2.5rem' }}>{weather.icon}</span>
      </div>

      <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>
        {weather.temp}°C
      </div>
      <div style={{ marginBottom: '1.5rem', opacity: 0.9, fontSize: '1.1rem' }}>
        {weather.condition}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginBottom: '1.5rem',
        background: 'rgba(255,255,255,0.1)',
        padding: '1rem',
        borderRadius: '8px'
      }}>
        <div>
          <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>Humidity 💧</div>
          <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{weather.humidity}%</div>
        </div>
        <div>
          <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>Wind 💨</div>
          <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{weather.windSpeed} km/h</div>
        </div>
      </div>

      <div style={{
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.3)',
        fontSize: '0.9rem',
        display: 'flex',
        gap: '0.5rem'
      }}>
        <span>💡</span>
        <span>{getWeatherAdvice()}</span>
      </div>
    </div>
  );
};

export default WeatherWidget;
