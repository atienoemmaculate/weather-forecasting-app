document.getElementById('weather-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const location = encodeURIComponent(document.getElementById('location').value.trim());
    const apiKey = '87f1a6a841cbee438dbc3402afcd3d23'; // OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    // Save location to local storage
    localStorage.setItem('lastLocation', location);

    // Show loading spinner
    document.getElementById('weather-result').innerHTML = '<div class="spinner"></div>';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('API Response:', data); // Log the full response

            const weatherResult = document.getElementById('weather-result');
            if (data.cod === "200") {
                let forecastHTML = `<h2>${data.city.name}</h2>`;
                
                // Add current weather
                const currentWeather = data.list[0];
                forecastHTML += `
                    <h3>Current Weather</h3>
                    <img src="http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png" alt="${currentWeather.weather[0].description}">
                    <p>Temperature: ${currentWeather.main.temp} °C</p>
                    <p>Humidity: ${currentWeather.main.humidity} %</p>
                    <p>Wind Speed: ${currentWeather.wind.speed} m/s</p>
                    <p>${currentWeather.weather[0].description}</p>
                `;
                
                // Add 5-day forecast
                forecastHTML += `<h3>5-Day Forecast</h3>`;
                const forecastDays = data.list.filter((entry, index) => index % 8 === 0); // Get forecast for every 24 hours

                forecastDays.forEach(day => {
                    forecastHTML += `
                        <div class="forecast-day">
                            <h4>${new Date(day.dt * 1000).toLocaleDateString()}</h4>
                            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
                            <p>Temperature: ${day.main.temp} °C</p>
                            <p>${day.weather[0].description}</p>
                        </div>
                    `;
                });

                weatherResult.innerHTML = forecastHTML;
            } else {
                weatherResult.innerHTML = `<p>${data.message}</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
            document.getElementById('weather-result').innerHTML = `<p>There was an error fetching the weather data. Please try again.</p>`;
        });
});
