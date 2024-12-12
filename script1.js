const saveFavoriteButton = document.getElementById("saveFavoriteButton");
const favoriteLocationsList = document.getElementById("favoriteLocations");

window.addEventListener("load", loadFavoriteLocations);

saveFavoriteButton.addEventListener("click", saveFavoriteLocation);

function saveFavoriteLocation() {
  const currentCity = city.innerText;
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (!favorites.includes(currentCity)) {
    favorites.push(currentCity);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    loadFavoriteLocations();
    alert(`${currentCity} added to favorites!`);
  } else {
    alert(`${currentCity} is already in your favorites.`);
  }
}

function loadFavoriteLocations() {
  favoriteLocationsList.innerHTML = "";

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favorites.forEach((location) => {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item text-center";
    listItem.textContent = location;
    listItem.addEventListener("click", () => {
      fetchWeather(location);
      fetchForecast(location);
    });
    favoriteLocationsList.appendChild(listItem);
  });
}

const suggestionsList = document.getElementById("suggestions");

function getSearchSuggestions() {
  const apiKey = "664b1d004cadbf77bfe12998bb540dcc";
  const query = userLocation.value.trim();
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;

  fetch(url)
    .then((response) => {
      // console.log(response);
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      displaySuggestions(data);
    })
    .catch((error) => {
      console.error("Error fetching location suggestions:", error.message);
    });
}

function displaySuggestions(suggestions) {
  suggestionsList.innerHTML = "";
  if (suggestions.length === 0) {
    suggestionsList.innerHTML = `<li class="list-group-item">No matches found</li>`;
    return;
  }

  suggestions.forEach((location) => {
    const suggestionItem = document.createElement("li");
    suggestionItem.classList.add("list-group-item");
    suggestionItem.textContent = `${location.name}, ${location.country}`;
    suggestionItem.style.cursor = "pointer";
    suggestionItem.onclick = () => {
      userLocation.value = location.name;
      suggestionsList.innerHTML = "";
    };
    suggestionsList.appendChild(suggestionItem);
  });
}
