/*=========================================
 storage.js
 Handles Local Storage Operations
=========================================*/

const SETTINGS_KEY = "weatherSettings";
const FAVORITES_KEY = "favoriteCities";

/*=========================================
 Default Settings
=========================================*/

const DEFAULT_SETTINGS = {
    defaultCity: "London",
    units: "metric", // metric | imperial
    theme: "light"
};

/*=========================================
 Settings
=========================================*/

export function saveSettings(settings) {

    localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(settings)
    );

}

export function loadSettings() {

    const saved =
        localStorage.getItem(SETTINGS_KEY);

    return saved
        ? JSON.parse(saved)
        : DEFAULT_SETTINGS;

}

export function updateSetting(key, value) {

    const settings = loadSettings();

    settings[key] = value;

    saveSettings(settings);

}

/*=========================================
 Favorites
=========================================*/

export function getFavorites() {

    const favorites =
        localStorage.getItem(FAVORITES_KEY);

    return favorites
        ? JSON.parse(favorites)
        : [];

}

export function saveFavorites(favorites) {

    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favorites)
    );

}

export function addFavorite(city) {

    const favorites = getFavorites();

    const normalizedCity = city.trim();

    const exists = favorites.some(
        item =>
            item.toLowerCase() ===
            normalizedCity.toLowerCase()
    );

    if (!exists) {

        favorites.push(normalizedCity);

        saveFavorites(favorites);

    }

    return favorites;

}

export function removeFavorite(city) {

    const favorites = getFavorites().filter(
        item =>
            item.toLowerCase() !==
            city.toLowerCase()
    );

    saveFavorites(favorites);

    return favorites;

}

export function clearFavorites() {

    localStorage.removeItem(FAVORITES_KEY);

}

export function isFavorite(city) {

    return getFavorites().some(
        item =>
            item.toLowerCase() ===
            city.toLowerCase()
    );

}

/*=========================================
 Theme
=========================================*/

export function saveTheme(theme) {

    const settings = loadSettings();

    settings.theme = theme;

    saveSettings(settings);

}

export function loadTheme() {

    return loadSettings().theme;

}

/*=========================================
 Temperature Unit
=========================================*/

export function saveUnit(unit) {

    const settings = loadSettings();

    settings.units = unit;

    saveSettings(settings);

}

export function loadUnit() {

    return loadSettings().units;

}

/*=========================================
 Default City
=========================================*/

export function saveDefaultCity(city) {

    const settings = loadSettings();

    settings.defaultCity = city;

    saveSettings(settings);

}

export function loadDefaultCity() {

    return loadSettings().defaultCity;

}

/*=========================================
 Utility
=========================================*/

export function resetStorage() {

    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(FAVORITES_KEY);

}