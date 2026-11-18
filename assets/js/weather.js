"use strict";

(function () {
    const status = document.getElementById("weather-status");
    const data = document.getElementById("weather-data");
    const retry = document.getElementById("weather-retry");
    if (!status || !data || !retry) return;

    const descriptions = {
        0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
        45: "Fog", 48: "Depositing rime fog", 51: "Light drizzle", 53: "Drizzle",
        55: "Dense drizzle", 61: "Light rain", 63: "Rain", 65: "Heavy rain",
        71: "Light snow", 73: "Snow", 75: "Heavy snow", 80: "Rain showers",
        81: "Rain showers", 82: "Heavy rain showers", 95: "Thunderstorm",
        96: "Thunderstorm with hail", 99: "Thunderstorm with hail"
    };

    async function loadWeather() {
        status.textContent = "Loading current weather…";
        data.hidden = true;
        retry.hidden = true;
        try {
            const url = "https://api.open-meteo.com/v1/forecast?latitude=51.1694&longitude=71.4491&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Asia%2FAlmaty";
            const response = await fetch(url);
            if (!response.ok) throw new Error("Weather service returned " + response.status);
            const result = await response.json();
            const current = result && result.current;
            if (!current || current.temperature_2m == null || current.relative_humidity_2m == null) {
                status.textContent = "The weather service returned no current conditions for Astana.";
                return;
            }
            const description = descriptions[current.weather_code] || "Current conditions";
            const temperature = document.createElement("strong");
            temperature.className = "weather-temperature";
            temperature.textContent = Math.round(current.temperature_2m) + "°C";
            const conditions = document.createElement("span");
            conditions.textContent = description;
            const humidity = document.createElement("span");
            humidity.textContent = "Humidity " + current.relative_humidity_2m + "%";
            data.replaceChildren(temperature, conditions, humidity);
            data.hidden = false;
            status.textContent = "Current conditions in Astana.";
        } catch (error) {
            status.textContent = "Weather is unavailable right now. Please try again.";
            retry.hidden = false;
            console.warn("Astana weather could not be loaded.", error);
        }
    }

    retry.addEventListener("click", loadWeather);
    loadWeather();
}());
