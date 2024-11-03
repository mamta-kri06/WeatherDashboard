const saveFavoriteButton = document.getElementById("saveFavoriteButton");
const favoriteLocationsList = document.getElementById("favoriteLocations");

// Load favorites on page load
window.addEventListener("load", loadFavoriteLocations);

// Save current city as favorite
saveFavoriteButton.addEventListener("click", saveFavoriteLocation);

function saveFavoriteLocation() {
  const currentCity = city.innerText; // Use the current displayed city name
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Add city if it's not already in the list
  if (!favorites.includes(currentCity)) {
    favorites.push(currentCity);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    loadFavoriteLocations(); // Refresh favorite locations list
    alert(`${currentCity} added to favorites!`);
  } else {
    alert(`${currentCity} is already in your favorites.`);
  }
}

function loadFavoriteLocations() {
  // Clear existing list
  favoriteLocationsList.innerHTML = "";

  // Get favorites from localStorage
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Populate list with favorite locations
  favorites.forEach((location) => {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item";
    listItem.textContent = location;
    listItem.addEventListener("click", () => {
      fetchWeather(location);
      fetchForecast(location);
    });
    favoriteLocationsList.appendChild(listItem);
  });
}
