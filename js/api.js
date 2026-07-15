/*===========================================
 api.js
 Handles all OpenWeatherMap API requests
===========================================*/

const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";

const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function getCurrentWeather(city, unit = "metric") {

    try {

        const response = await fetch(

            `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${unit}`

        );

        if (!response.ok) {

            throw new Error("City not found.");

        }

        return await response.json();

    } catch (error) {

        console.error(error);

        throw error;

    }

}

export async function getForecast(city, unit = "metric") {

    try {

        const response = await fetch(

            `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${unit}`

        );

        if (!response.ok) {

            throw new Error("Forecast unavailable.");

        }

        return await response.json();

    } catch (error) {

        console.error(error);

        throw error;

    }

}

export async function getWeatherByLocation(lat, lon, unit = "metric") {

    try {

        const response = await fetch(

            `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`

        );

        if (!response.ok) {

            throw new Error("Unable to fetch location weather.");

        }

        return await response.json();

    } catch (error) {

        console.error(error);

        throw error;

    }

}

export function getIconUrl(icon) {

    return `https://openweathermap.org/img/wn/${icon}@2x.png`;

}