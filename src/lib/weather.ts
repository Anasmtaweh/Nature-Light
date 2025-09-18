const API_KEY = "30c5b1c8ef717f24aa4708a435bdf69d"; // User provided API key

export const getWeatherData = async (location: string, date: string) => {
  // For simplicity, we'll use the current weather API for now.
  // For historical or future weather, a different API endpoint or service would be needed.
  // OpenWeatherMap's One Call API (paid) can provide historical/forecast data.

  try {
    // First, get coordinates for the location
    const geoResponse = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`
    );
    const geoData = await geoResponse.json();

    if (!geoData || geoData.length === 0) {
      console.error("Location not found:", location);
      return null;
    }

    const { lat, lon } = geoData[0];

    // Then, get current weather for the coordinates
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const weatherData = await weatherResponse.json();

    if (weatherData.cod !== 200) {
      console.error("Weather data error:", weatherData.message);
      return null;
    }

    return {
      temperature: weatherData.main.temp,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      city: weatherData.name,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};
