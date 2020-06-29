const form = document.querySelector("form");
const input = document.querySelector("input");
const error = document.querySelector('.error');
const loadingImage = document.querySelector('.loading');
const results = document.querySelector('.results');

loadingImage.style.display = 'none';


function getDayCard(day) {
    return `
    <div class="weather-card">
    <h1> ${day.applicable_date}</h1>
        <img src="https://www.metaweather.com/static/img/weather/${day.weather_state_abbr}.svg">
        <p><span class="label">Average:</span>  <span class="value">${day.the_temp.toFixed(2)}°C</span></p>
        <p><span class="label">Min:</span>  <span class="value">${day.min_temp.toFixed(2)}°C</span></p>
        <p><span class="label">Max:</span>  <span class="value">${day.max_temp.toFixed(2)}°C</span></p>

    </div>
    `
}


async function getWeather(name) {
    results.innerHTML = '';
    const response = await fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query=${name}`);
    const json = await response.json();
    const [location] = json;
    if (location) {
        const response2 = await fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${location.woeid}`);
        const json2 = await response2.json();
        if (json2.consolidated_weather) {
            let html = '';
            json2
                .consolidated_weather
                .forEach((day) => html = html + getDayCard(day));
            results.innerHTML = html;
        } else {
            error.textContent = "Error getting forecast data ";
        }

    } else {
        error.textContent = "location not found";
    }
    loadingImage.style.display = 'none';
};

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const location = input.value;
    if (!location) {
        error.textContent = "You must enter a location";
    } else {
        loadingImage.style.display = '';
        error.textContent = "";
        getWeather(location)
    }
});