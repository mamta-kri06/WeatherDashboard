const defaultCity = "Dhanbad";

const userLocation = document.getElementById("userLocation");
const weathericon = document.querySelector(".weathericon");
const temperature = document.querySelector(".temperature");
const feelslike = document.querySelector(".feelslike");
const description = document.querySelector(".description");
const city = document.querySelector(".city");
const date = document.querySelector(".date");

const PValue = document.getElementById("PValue");
const HValue = document.getElementById("HValue");
const WValue = document.getElementById("WValue");
const minValue = document.getElementById("MinValue");
const maxValue = document.getElementById("MaxValue");
const forecastContainer = document.querySelector(".forecast"); 

function fetchWeather(cityName) {
  const apiKey = "664b1d004cadbf77bfe12998bb540dcc"; 
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404) {
          alert("Enter a valid city");
          userLocation.innerHTML = "";
        }
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Current Weather data:", data);

      city.innerHTML = `${data.name}, ${data.sys.country}`;

      const now = new Date();
      const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      date.innerHTML = now.toLocaleDateString("en-US", options);

      // Set the weather icon
      const iconCode = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@3x.png`;
      weathericon.src = iconUrl; 

      temperature.innerHTML = `${Math.round(data.main.temp)}°C`;
      feelslike.innerHTML = `Feels Like: ${Math.round(data.main.feels_like)}°C`;
      description.innerHTML = data.weather[0].description;

      PValue.innerHTML = `${data.main.pressure} hPa`;
      WValue.innerHTML = `${data.wind.speed} m/s`;
      HValue.innerHTML = `${data.main.humidity}%`;
      minValue.innerHTML = `${Math.round(data.main.temp_min)}°C`;
      maxValue.innerHTML = `${Math.round(data.main.temp_max)}°C`;

      const sunriseTime = new Date(
        data.sys.sunrise * 1000
      ).toLocaleTimeString();
      const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();

      SRValue.innerHTML = `Sunrise: ${sunriseTime}`;
      SSValue.innerHTML = `Sunset: ${sunsetTime}`;
    })
    .catch((error) => {
      if (error.message.includes("Network response was not ok")) {
        console.error("There was a problem with the fetch operation:", error);
      }
    });
}

function fetchForecast(cityName) {
  const apiKey = "664b1d004cadbf77bfe12998bb540dcc"; 
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Forecast data:", data);
      displayForecast(data);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function displayForecast(data) {
  forecastContainer.innerHTML = ""; 

  const dailyData = {};
  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    if (!dailyData[date]) {
      dailyData[date] = [];
    }
    dailyData[date].push(item);
  });

  Object.keys(dailyData).forEach((date, index) => {
    if (index >= 5) return; 

    const dayData = dailyData[date];
    const temp = Math.round(
      dayData.reduce((sum, item) => sum + item.main.temp, 0) / dayData.length
    );
    const description = dayData[0].weather[0].description;
    const iconCode = dayData[0].weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const dayForecast = document.createElement("div");
    dayForecast.classList.add("day-forecast");
    dayForecast.innerHTML = `
      <h4>${date}</h4>
      <img src="${iconUrl}" alt="${description}" />
      <p>${temp}°C</p>
      <p>${description}</p>
    `;

    forecastContainer.appendChild(dayForecast);
  });
}

function findUserLocation() {
  const cityName = userLocation.value.trim() || defaultCity; 
  fetchWeather(cityName);
  fetchForecast(cityName);
}

window.addEventListener("load", () => {
  userLocation.value = ""; 
  fetchWeather(defaultCity);
  fetchForecast(defaultCity);
});

const searchButton = document.getElementById("searchButton"); 
searchButton.addEventListener("click", findUserLocation);
