/*=========================================
 app.js
 Main Application Logic
=========================================*/

import {
    getCurrentWeather,
    getForecast,
    getWeatherByLocation,
    getIconUrl
} from "./api.js";

import {
    loadSettings,
    saveSettings,
    getFavorites,
    addFavorite,
    clearFavorites
} from "./storage.js";

/*=========================================
 DOM Elements
=========================================*/

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");

const loading = document.getElementById("loading");
const error = document.getElementById("error");

const currentWeather = document.getElementById("current-weather");

const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feels-like");
const pressure = document.getElementById("pressure");

const forecastGrid = document.getElementById("forecast-grid");

const favoriteList = document.getElementById("favorite-list");
const clearFavoritesBtn = document.getElementById("clear-favorites");

const themeToggle = document.getElementById("theme-toggle");

const unitSelect = document.getElementById("unit-select");
const defaultCityInput = document.getElementById("default-city");
const saveSettingsBtn = document.getElementById("save-settings");

const year = document.getElementById("year");

/*=========================================
 Settings
=========================================*/

let settings = loadSettings();

unitSelect.value = settings.units;
defaultCityInput.value = settings.defaultCity;

/*=========================================
 Helper Functions
=========================================*/

function showLoading() {

    loading.classList.remove("hidden");
    error.classList.add("hidden");
    currentWeather.classList.add("hidden");

}

function hideLoading() {

    loading.classList.add("hidden");

}

function showError(message) {

    error.classList.remove("hidden");
    error.innerHTML = `<p>${message}</p>`;

}

function hideError() {

    error.classList.add("hidden");

}

function displayCurrentWeather(data) {

    cityName.textContent =
        `${data.name}, ${data.sys.country}`;

    temperature.textContent =
        `${Math.round(data.main.temp)}°`;

    description.textContent =
        data.weather[0].description;

    humidity.textContent =
        `${data.main.humidity}%`;

    wind.textContent =
        `${data.wind.speed}`;

    feelsLike.textContent =
        `${Math.round(data.main.feels_like)}°`;

    pressure.textContent =
        `${data.main.pressure} hPa`;

    weatherIcon.src =
        getIconUrl(data.weather[0].icon);

    weatherIcon.alt =
        data.weather[0].description;

    currentWeather.classList.remove("hidden");

}

function displayForecast(data) {

    forecastGrid.innerHTML = "";

    const daily = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    daily.forEach(day => {

        const card = document.createElement("div");

        card.className = "forecast-card";

        const date = new Date(day.dt_txt);

        card.innerHTML = `
            <h3>${date.toDateString()}</h3>

            <img
                src="${getIconUrl(day.weather[0].icon)}"
                alt="${day.weather[0].description}"
            >

            <h2>${Math.round(day.main.temp)}°</h2>

            <p>${day.weather[0].description}</p>
        `;

        forecastGrid.appendChild(card);

    });

}

/*=========================================
 Weather Search
=========================================*/

async function searchWeather(city) {

    try {

        showLoading();

        const weather =
            await getCurrentWeather(
                city,
                settings.units
            );

        const forecast =
            await getForecast(
                city,
                settings.units
            );

        displayCurrentWeather(weather);

        displayForecast(forecast);

        hideLoading();

        hideError();

        addFavorite(city);

        renderFavorites();

    }

    catch (err) {

        hideLoading();

        showError(err.message);

    }

}

/*=========================================
 Geolocation
=========================================*/

async function loadCurrentLocation() {

    if (!navigator.geolocation) {

        showError("Geolocation is not supported.");

        return;

    }

    navigator.geolocation.getCurrentPosition(

        async (position) => {

            try {

                showLoading();

                const weather =
                    await getWeatherByLocation(

                        position.coords.latitude,

                        position.coords.longitude,

                        settings.units

                    );

                cityInput.value = weather.name;

                searchWeather(weather.name);

            }

            catch (error) {

                hideLoading();

                showError(error.message);

            }

        },

        () => {

            showError("Location permission denied.");

        }

    );

}

/*=========================================
 Favorites
=========================================*/

function renderFavorites() {

    favoriteList.innerHTML = "";

    const favorites = getFavorites();

    favorites.forEach(city => {

        const button =
            document.createElement("button");

        button.className =
            "favorite-city";

        button.textContent =
            city;

        button.onclick = () => {

            cityInput.value = city;

            searchWeather(city);

        };

        favoriteList.appendChild(button);

    });

}

/*=========================================
 Theme
=========================================*/

function applyTheme() {

    if (settings.theme === "dark") {

        document.body.classList.add("dark");

        themeToggle.textContent = "☀";

    }

    else {

        document.body.classList.remove("dark");

        themeToggle.textContent = "🌙";

    }

}

themeToggle.addEventListener("click", () => {

    settings.theme =
        settings.theme === "light"
            ? "dark"
            : "light";

    saveSettings(settings);

    applyTheme();

});

/*=========================================
 Save Preferences
=========================================*/

saveSettingsBtn.addEventListener("click", () => {

    settings.units =
        unitSelect.value;

    settings.defaultCity =
        defaultCityInput.value.trim();

    saveSettings(settings);

    alert("Preferences saved.");

});

/*=========================================
 Events
=========================================*/

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city) {

        searchWeather(city);

    }

});

cityInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        searchBtn.click();

    }

});

locationBtn.addEventListener(

    "click",

    loadCurrentLocation

);

clearFavoritesBtn.addEventListener(

    "click",

    () => {

        clearFavorites();

        renderFavorites();

    }

);

/*=========================================
 Footer
=========================================*/

year.textContent =
    new Date().getFullYear();

/*=========================================
 Initialize
=========================================*/

applyTheme();

renderFavorites();

searchWeather(settings.defaultCity);