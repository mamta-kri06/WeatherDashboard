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
