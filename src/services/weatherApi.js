const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

//const API_KEY = "04bd3c16c90c058835bdfe34ea023e87";

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherByCity = async (city) => {
  if (!API_KEY) {
    throw new Error("API key is missing. Check your .env file.");
  }

  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to fetch weather data");
    }

    return data;
  } catch (error) {
    console.error("Weather API Error:", error);
    throw error;
  }
};