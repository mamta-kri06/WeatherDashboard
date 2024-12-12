const defaultCity = "Dhanbad";

const userLocation = document.getElementById("userLocation");
const weathericon = document.querySelector(".weathericon");
const temperature = document.querySelector(".temperature");
const feelslike = document.querySelector(".feelslike");
const description = document.querySelector(".description");
const date = document.querySelector(".date");
const city = document.querySelector(".city");

const PValue = document.getElementById("PValue");
const HValue = document.getElementById("HValue");
const WValue = document.getElementById("WValue");
const minValue = document.getElementById("MinValue");
const maxValue = document.getElementById("MaxValue");
const forecastContainer = document.querySelector(".forecast");

const searchButton = document.getElementById("searchButton");

function findUserLocation() {
  const cityName = userLocation.value.trim();
  fetchWeather(cityName);
  fetchForecast(cityName);
}

window.addEventListener("load", () => {
  fetchWeather(defaultCity);
  fetchForecast(defaultCity);
});

function fetchWeather(cityName) {
  const apiKey = "664b1d004cadbf77bfe12998bb540dcc";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404) {
          alert("Enter a valid city");
          console.log(response);
          userLocation.innerHTML = "";
        }
        throw new Error(
          `HTTP Error: ${response.status} - ${response.statusText}`
        );
      }
      console.log(response);
      console.log(response.body);
      return response.json();
    })
    .then((data) => {
      console.log(data);
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
      // console.log(now);
      date.innerHTML = now.toLocaleDateString("en-US", options);
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
      // console.log(error);
      console.error("Error occurred:", error.message);
    });
}

function fetchForecast(cityName) {
  const apiKey = "664b1d004cadbf77bfe12998bb540dcc";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        `HTTP Error: ${response.status} - ${response.statusText}`;
      }
      return response.json();
    })
    .then((data) => {
      displayForecast(data);
    })
    .catch((error) => {
      console.error("Error occurred:", error.message);
    });
}

function displayForecast(data) {
  console.log(data);
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
  Object.keys(dailyData).forEach((date) => {
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
      <h5>${date}</h5>
      <img src="${iconUrl}" alt="${description}" />
      <h6>${temp}°C</h6>
      <p style="color:black">${description}</p>
    `;
    forecastContainer.appendChild(dayForecast);
  });
}
