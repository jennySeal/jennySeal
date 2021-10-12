import { jawgKey } from "./config.js";

//Set up country object with all the info options
const country = {
  iso2: "",
  population: 0,
  countryName: "",
  currency: "",
  capital: "",
  flag: "",
  area: 0,
  mintemp: 0,
  maxtemp: 0,
  windspeed: 0,
  weathericon: "",
  weatherDescription: "",
  activeCovidCases: 0,
  criticalCovidcases: 0,
  totalCovidCases: 0,
  totalCovidDeaths: 0,
  USDexchange: 0,
  EURexchange: 0,
  newsTitle: "",
  newsTitle2: "",
  newsTitle3: "",
  newsTitle4: "",
  newsLink: "",
  newsLink2: "",
  newsLink3: "",
  newsLink4: "",
  newsImage: "",
  newsImage2: "",
  newsImage3: "",
  newsImage4: "",
  officialName: "",
  demonym: "",
  currencyName: "",
  currencySymbol: "",
  languages: [],
};

const iconOptions = {
  iconUrl: "./libs/css/marker-red.png",
  iconSize: [30, 30],
};

let clickLocationLat = 0;
let clickLocationLng = 0;
let getCapital = false;
let placeName = "";
let timeoffset = 0;

let geoJsonFeature = {};
const markers = L.markerClusterGroup();

//Run pre-loader
$(document).ready(function () {
  if ($(".spinner-wrapper").length) {
    $(".spinner-wrapper")
      .delay(3000)
      .fadeOut(3000, function () {
        $(".spinner-wrapper").remove();
      });
  }
});

//Set up Leaflet maps
const map = L.map("map").fitWorld();

//using Jawg Streets
const mapDesign = L.tileLayer(
  "https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token={accessToken}",
  {
    attribution:
      '<a href="http://jawg.io" title="Tiles by  Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 0,
    maxZoom: 22,
    subdomains: "abcd",
    accessToken: jawgKey,
    crossOrigin: "",
  }
);

mapDesign.addTo(map);
const redIcon = L.icon(iconOptions);

//On load find the user's location and add a marker
const onLocationFound = (e) => {
  clickLocationLat = e.latlng.lat;
  clickLocationLng = e.latlng.lng;
  const radius = e.accuracy / 2;
  const redMarker = L.marker(e.latlng, {
    icon: redIcon,
    clickable: true,
    zIndexOffset: 200,
  });
  redMarker.bindPopup(`&#x1F30E You are here!`).openPopup().addTo(map);
  L.circleMarker(e.latlng, radius).addTo(map);

  //populate the drop down list with countries
  getSelectData();
  //find out iso2 code
  getCountryCode(clickLocationLat, clickLocationLng);
};

//if not allowed location data center on London
const onLocationError = (e) => {
  clickLocationLat = 51.50853;
  clickLocationLng = -0.12574;
  L.popup()
    .setLatLng(e.latlng)
    .setContent(`&#x1F30E The capital of the United Kingdom is London.`)
    .openOn(map);
  getSelectData();
  getCountryCode(clickLocationLat, clickLocationLng);
};

map.on("locationfound", onLocationFound);
map.on("locationerror", onLocationError);

let largeScreenCheck = window.matchMedia("(min-width: 1000px)");
largeScreenCheck.matches
  ? map.locate({ setView: `{clickLocationLat, clickLocationLng}`, maxZoom: 10 })
  : map.locate({ setView: `{clickLocationLat, clickLocationLng}`, maxZoom: 7 });

// When the user clicks on the map go to clicked location rather than capital
map.on("dblclick", function (e) {
  getCapital = false;
  getCountryCode(e.latlng.lat, e.latlng.lng);
  clickLocationLat = e.latlng.lat;
  clickLocationLng = e.latlng.lng;
});

//Once we have coordinates we can get the country code
const getCountryCode = (lat, lng) => {
  callApi("getCountryCode", lat, lng, useCountryCode);
};
// and use it to get the name, population, capital, area, currency and flag info
const useCountryCode = (data) => {
  country.iso2 = data.data;
  callApi("getCountryInfo", "en", country.iso2, getBasicData);
  callApi("getPolygon", country.iso2, "", displayPolygon);
};

// Set up buttons to open and close modal and call Api if necessary
$("#closeModal").click(function () {
  $("#modal").slideUp("fast", function () {});
});

$("#homebutton").click(function () {
  displayTopLevel();
  $("#modal").slideDown("slow", function () {});
});

$("#weatherIcon").click(function () {
  callApi("getWeather", country.capital, "metric", getWeatherData);
  $("#modal").slideDown("slow", function () {});
});

$("#virusIcon").click(function () {
  callApi("getVirus", country.iso2, false, getVirusData);
  $("#modal").slideDown("slow", function () {});
});

$("#moneyIcon").click(function () {
  callApi("getMoney", country.currency, "", getMoneyData);
  $("#modal").slideDown("slow", function () {});
});

$("#newsIcon").click(function () {
  callApi("getNews", country.iso2, country.demonym, getNews);
  $("#modal").slideDown("slow", function () {});
});

/*Set up the select list from the countryBorders.geo.json - returns an array of arrays with name and iso2 of each country.*/
const getSelectData = () => {
  callApi("getSelectData", "", "", displaySelectData);
};

const displaySelectData = (data) => {
  const results = data.data;
  for (let i = 0; i < results.length; i++) {
    const selectOption = results[i][0];
    const isoOption = results[i][1];
    $("#countrySelect").append(
      `<option value="${isoOption}">${selectOption}</option>`
    );
  }
};

//when select is opted for zoom to capital
$("#countrySelect").change(function () {
  country.iso2 = $("#countrySelect option:selected").val();
  getCapital = true;
  callApi("getCountryInfo", "en", country.iso2, getBasicData);
  callApi("getPolygon", country.iso2, "", displayPolygon);
});

// get countryname, currency, capital, flag, area
const getBasicData = (data) => {
  const results = data.data[0];
  country.population = parseFloat(results.population / 1000000);
  country.countryName = results.countryName;
  country.currency = results.currencyCode;
  country.capital = results.capital;

  let screenCheck = window.matchMedia("(min-width: 400px)");
  if (screenCheck.matches) {
    country.flag = `https://www.countryflags.io/${country.iso2}/shiny/64.png`;
  } else {
    country.flag = `https://www.countryflags.io/${country.iso2}/shiny/48.png`;
  }
  //add commas into the area number
  country.area = Math.round(results.areaInSqKm).toLocaleString("en-US");

  $("#titleCountry").html(country.countryName);
  $("#flag").attr("src", country.flag);

  callApi(
    "getMoreCountryInfo",
    country.iso2,
    country.currency,
    saveMoreBasicData
  );

  //either zoom to capital or clicked place/users location
  if (getCapital === false) {
    callApi("getPlaceInfo", clickLocationLat, clickLocationLng, zoomToPlace);
  } else {
    let countryCapitalMinusSpaces = country.capital.split(" ").join("_");
    //New_Delhi points to an Indian restauarant in Vietnam!
    if (countryCapitalMinusSpaces === "New_Delhi") {
      countryCapitalMinusSpaces = "Delhi";
    }
    callApi("getCapitalCoords", countryCapitalMinusSpaces, "", zoomToPlace);
  }
};

//get the extra top level info and call the display
const saveMoreBasicData = (data) => {
  country.officialName = data.officialName;
  country.demonym = data.demonym;
  country.currencyName = data.currencies.name;
  country.currencySymbol = data.currencies.symbol;
  country.languages = data.languages;

  displayTopLevel();
};

// populate the marker with the sunrise, plus clock, plus go to location
const zoomToPlace = (data) => {
  if (getCapital) {
    clickLocationLat = data.data.lat;
    clickLocationLng = data.data.lng;
    placeName = country.capital;
  } else {
    placeName = data.data;
  }
  const sunrise = data.sunrise;
  timeoffset = data.timeoffset;
  const sunriseString = getSunrise(sunrise);
  setCurrentTime(timeoffset);

  const mapOptions = {
    lat: clickLocationLat,
    lng: clickLocationLng,
    zoom: 4,
  };
  map.setZoom(4).flyTo(mapOptions);
  const redMarker = L.marker([clickLocationLat, clickLocationLng], {
    icon: redIcon,
    clickable: true,
    ZindexOffset: 200,
    opacity: 0.8,
  });
  if (getCapital) {
    redMarker
      .addTo(map)
      .bindPopup(
        `The capital of ${country.countryName} is ${country.capital}. <br>${sunriseString}`
      );
  } else {
    redMarker
      .addTo(map)
      .bindPopup(`This is ${placeName}. <br>${sunriseString}`);
  }

  callApi("getCafes", clickLocationLat, clickLocationLng, displayMarkers);
};

// present the sunrise in the marker
const getSunrise = (sunrise) => {
  const date = new Date(sunrise * 1000);
  const hours = date.getUTCHours().toString().padStart(2, 0);
  const minutes = date.getUTCMinutes().toString().padStart(2, 0);
  const seconds = date.getUTCSeconds().toString().padStart(2, 0);
  return `The sun rose at ${hours}:${minutes}:${seconds}`;
};
// and change the local time
const setCurrentTime = (timeoffset) => {
  const currentTime = Date.now();
  const time = new Date(currentTime + timeoffset * 1000);
  const currentHours = time.getUTCHours().toString().padStart(2, 0);
  const currentMinutes = time.getUTCMinutes().toString().padStart(2, 0);
  $("#timeDisplay").html(`${currentHours}:${currentMinutes}`);
};

// put a polygon or multi-polygon around selected country
const displayPolygon = (data) => {
  if (data.data.length > 1) {
    geoJsonFeature = {
      type: "Feature",
      geometry: {
        type: "MultiPolygon",
        coordinates: data.data,
      },
    };
  } else {
    geoJsonFeature = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: data.data,
      },
    };
  }

  L.geoJson(geoJsonFeature, {
    style: { color: "#ffe135", opacity: "0.7", weight: "2" },
  }).addTo(map);
};

// Populate home button and titleCountry + flag
const displayTopLevel = () => {
  $("#item-A").html(country.officialName);
  $("#flag2").attr("src", country.flag);

  $("#item-B").html("Capital:");
  $("#item-2").html(country.capital);
  $("#item-C").html("Population:");
  $("#item-3").html(country.population.toFixed(2) + "m");
  $("#item-D").html("Inhabitants:");
  $("#item-D").append("<br>Area:");
  $("#item-4").html(country.demonym);
  $("#item-4").append(`<br>${country.area} km2`);
  $("#item-E").html("Languages:");
  const languages = Object.values(country.languages);

  $("#item-5").html(`${languages[0]}`);
  if (languages.length > 1) {
    for (let i = 1; i < languages.length; i++) {
      $("#item-5").append(`<br>${languages[i]}`);
    }
  }
};

// populate weather info and display it
const getWeatherData = (data) => {
  const results = data.data;
  country.weatherDescription = results.weather[0].description;
  country.maxtemp = results.main.temp_max;
  country.mintemp = results.main.temp_min;
  country.windspeed = parseFloat(results.wind.speed);
  country.windspeed = (2.23694 * country.windspeed).toFixed(2);
  country.weathericon = results.weather[0].icon;
  displayWeather();
};

const displayWeather = () => {
  $("#item-A").html("The Weather Today");
  largeScreenCheck.matches
    ? $("#item-B").html(
        `<img src="http://openweathermap.org/img/wn/${country.weathericon}@2x.png" alt="Weather conditions:">`
      )
    : $("#item-B").html(
        `<img src="http://openweathermap.org/img/wn/${country.weathericon}.png" alt="Weather conditions:">`
      );
  $("#item-2").html(country.weatherDescription);
  $("#item-C").html("Max Temp:");
  $("#item-3").html(`${country.maxtemp}&#176;C`);
  $("#item-D").html("Min Temp:");
  $("#item-4").html(`${country.mintemp}&#176;C`);
  $("#item-E").html("Wind Speed:");
  $("#item-5").html(`${country.windspeed} mph`);
};

// populate virus modal and display it
const getVirusData = (data) => {
  const results = data.data;
  country.activeCovidCases = results.active.toLocaleString("en-US");
  country.criticalCovidcases = results.critical.toLocaleString("en-US");
  country.totalCovidCases = results.cases.toLocaleString("en-US");
  country.totalCovidDeaths = results.deaths.toLocaleString("en-US");
  displayVirus();
};

const displayVirus = () => {
  $("#item-A").html("Coronavirus Rates");

  $("#item-B").html("Active cases:");
  $("#item-2").html(country.activeCovidCases);
  $("#item-C").html("Critical cases:");
  $("#item-3").html(country.criticalCovidcases);
  $("#item-D").html("Total cases:");
  $("#item-4").html(country.totalCovidCases);
  $("#item-E").html("Total deaths:");
  $("#item-5").html(country.totalCovidDeaths);
};

//populate money modal and display it
const getMoneyData = (data) => {
  const results = data.data.conversion_rates;
  country.USDexchange = results.USD;
  country.EURexchange = results.EUR;
  displayMoney();
};

const displayMoney = () => {
  $("#item-A").html(`Currency (${country.currency})`);

  $("#item-B").html("Money:");
  $("#item-2").html(country.currencyName);
  $("#item-C").html("Symbol:");
  $("#item-3").html(country.currencySymbol);
  $("#item-D").html("Exchange Rate with US $:");
  $("#item-4").html(country.USDexchange);
  $("#item-E").html("Exchange Rate with Euros &#8364;:");
  $("#item-5").html(country.EURexchange);
};

//populate news modal and display it
const getNews = (data) => {
  const results = data.data;
  if (results[0]) {
    country.newsTitle = results[0][0];
    country.newsLink = results[0][1];
    country.newsImage = results[0][2];
  }
  if (results[1]) {
    country.newsTitle2 = results[1][0];
    country.newsImage2 = results[1][2];
    country.newsLink2 = results[1][1];
  }
  if (results[2]) {
    country.newsTitle3 = results[2][0];
    country.newsLink3 = results[2][1];
    country.newsImage3 = results[2][2];
  }
  if (results[4]) {
    country.newsTitle4 = results[3][0];
    country.newsLink4 = results[3][1];
    country.newsImage4 = results[3][2];
  }
  displayNews();
};

const displayNews = () => {
  $("#item-A").html(`Latest News`);
  $("#item-B").html(`<img class="newsImage" src=${country.newsImage}>`);
  $("#item-2").html(
    `<a href=${country.newsLink} target="_blank">${country.newsTitle}</a>`
  );
  $("#item-C").html(`<img class="newsImage" src=${country.newsImage2}>`);
  $("#item-3").html(
    `<a href=${country.newsLink2} target="_blank">${country.newsTitle2}</a>`
  );
  $("#item-D").html(`<img class="newsImage" src=${country.newsImage3}>`);
  $("#item-4").html(
    `<a href=${country.newsLink3} target="_blank">${country.newsTitle3}</a>`
  );
  $("#item-E").html(`<img class="newsImage" src=${country.newsImage4}>`);
  $("#item-5").html(
    `<a href=${country.newsLink4} target="_blank">${country.newsTitle4}></a>`
  );
};

//populate cafe markers
const displayMarkers = (data) => {
  const results = data.data;
  results.map((touristAttraction) => {
    let cafeMarker = L.marker(touristAttraction[1]).bindPopup(
      `	&#9749; This is ${touristAttraction[0]}`
    );
    markers.addLayer(cafeMarker);
  });
};

//use easyButton to switch cafe markers on and off
const toggleMarkers = L.easyButton({
  states: [
    {
      stateName: "add-markers",
      icon: '<img src="./libs/css/coffee.png">',
      title: "Show Cafes",
      onClick: function (btn, map) {
        markers.addTo(map);
        btn.state("remove-markers");
      },
    },
    {
      stateName: "remove-markers",
      icon: '<img src="./libs/css/blackCoffee.png">',
      title: "Hide Cafes",
      onClick: function (btn, map) {
        map.removeLayer(markers);
        btn.state("add-markers");
      },
    },
  ],
});
toggleMarkers.addTo(map);

//Generic function for API call
const callApi = (phpToCall, parameter1, parameter2, callbackFun) => {
  const apiUrl = `libs/php/${phpToCall}.php`;
  $.ajax({
    url: apiUrl,
    type: "POST",
    dataType: "json",
    data: {
      param1: parameter1,
      param2: parameter2,
    },
    success: function (result) {
      callbackFun(result);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(`${apiUrl}: ajax call failed ${textStatus}`);
    },
  });
};
