
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
  GBPexchange: 0,
  JPYexchange: 0,
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
};

let clickLocationLat = 0;
let clickLocationLng = 0;
let click = true;

//Run pre-loader

$(document).ready(function () {
  if ($('.spinner-wrapper').length) {
    $('.spinner-wrapper').delay(2000).fadeOut(3000,function () {
      $('.spinner-wrapper').remove();
    });
  }
});


//Set up Leaflet maps
let map = L.map("map").fitWorld();

//using Jawg Streets
let mapDesign = L.tileLayer(
  "https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token={accessToken}",
  {
    attribution:
      '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 0,
    maxZoom: 22,
    subdomains: "abcd",
    accessToken: jawgKey,
    crossOrigin: "",
  }
);

//sets zoom level of initial screen depending on screen size
mapDesign.addTo(map);

 
//On load find the user's location

const onLocationFound = (e) => {
  clickLocationLat = e.latlng.lat;
  clickLocationLng = e.latlng.lng;
  let radius = e.accuracy / 2;
  L.popup().setLatLng(e.latlng).setContent(`&#x1F30E You are here`).openOn(map);  
  L.marker(e.latlng).addTo(map)
  L.circleMarker(e.latlng, radius).addTo(map);

  getSelectData();
  getCountryCode(clickLocationLat, clickLocationLng);
};

const onLocationError = (e) => {
  click = false;
  clickLocationLat = 51.50853;
  clickLocationLng = -0.12574;
  L.popup().setLatLng(e.latlng).setContent(`&#x1F30E The capital of the United Kingdom is London.`).openOn(map);
  getSelectData();
  getCountryCode(clickLocationLat, clickLocationLng);
}


  map.on('locationfound', onLocationFound);
  map.on('locationerror', onLocationError);


let largeScreenCheck = window.matchMedia("(min-width: 1000px)");
largeScreenCheck.matches
  ? map.locate({ setView: (`{clickLocationLat, clickLocationLng}`), maxZoom: 6 })
  : map.locate({ setView: (`{clickLocationLat, clickLocationLng}`), maxZoom: 5 });
 

map.on("dblclick", function (e) {
  click = true;
  getCountryCode(e.latlng.lat, e.latlng.lng);
	clickLocationLat = e.latlng.lat;
	clickLocationLng = e.latlng.lng;
	});
  


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
  callApi("getNews", country.iso2, "", getNews);
  $("#modal").slideDown("slow", function () {});
});

/*Set up the select list from the countryBorders.geo.json - returns an array of arrays with name and iso2
 of each country.*/

const getSelectData = () => {
  callApi("getSelectData", "", "", displaySelectData);
};

const displaySelectData = (data) => {
  let results = data.data;
  for (let i = 0; i < results.length; i++) {
    let selectOption = results[i][0];
    let isoOption = results[i][1];
    $("#countrySelect").append(
      `<option value="${isoOption}">${selectOption}</option>`
    );
  }
};

$("#countrySelect").change(function () {
  country.iso2 = $("#countrySelect option:selected").val();
  click = false;
  callApi("getCountryInfo", "en", country.iso2, getBasicData);
});

const zoomToPlace = (data) => {
  console.log(data)
  let lat = clickLocationLat;
  let lng = clickLocationLng;
  let placeName = data.data;
  let sunrise = data.sunrise;
  let timeoffset = data.timeoffset;
  let sunriseString = getSunrise(sunrise)
  setCurrentTime(timeoffset);
  setInterval(setCurrentTime(timeoffset), 60000);

  let mapOptions = {
    lat: clickLocationLat,
    lng: clickLocationLng,
    zoom: 5,
    maxZoom: 5,
  };
  map.setZoom(5).flyTo(mapOptions);
  L.marker([lat, lng]).addTo(map).bindPopup(
      `This is ${placeName}. <br>${sunriseString}`
    );
    callApi("getZoos", clickLocationLat, clickLocationLng, displayMarkers);
  };


const zoomToCapital = (data) => {
  let results = data.data;
  clickLocationLat = results.lat;
  clickLocationLng = results.lng;
  let sunrise = data.sunrise;
  let timeoffset = data.timeoffset;
  let sunriseString = getSunrise(sunrise)
  setCurrentTime(timeoffset);
  setInterval(setCurrentTime(timeoffset), 60000);

  let mapOptions = {
    lat: clickLocationLat,
    lng: clickLocationLng,
    zoom: 4,
    maxZoom: 4,

  };

  map.setZoom(4).flyTo(mapOptions);
  L.marker([clickLocationLat, clickLocationLng]).addTo(map).bindPopup(
      `The capital of ${country.countryName} is ${country.capital}. <br>${sunriseString}`
    );
    callApi("getZoos", clickLocationLat, clickLocationLng, displayMarkers);
  };

  // present the sunrise in the capital marker
  const getSunrise = (sunrise) => {
  let date = new Date(sunrise * 1000);
  let hours = date.getUTCHours().toString().padStart(2, 0);
  let minutes = date.getUTCMinutes().toString().padStart(2, 0);
  let seconds = date.getUTCSeconds().toString().padStart(2, 0);
  return `The sun rose at ${hours}:${minutes}:${seconds}`;
  }
  // and change the local time
  const setCurrentTime = (timeoffset) => {
    let currentTime = Date.now();
    let time = new Date(currentTime + timeoffset * 1000);
    let currentHours = time.getUTCHours().toString().padStart(2, 0);
    let currentMinutes = time.getUTCMinutes().toString().padStart(2, 0);

    $("#timeDisplay").html(`${currentHours}:${currentMinutes}`);
  };
  
//Once we have coordinates we can get the country code
const getCountryCode = (lat, lng) => {
  callApi("getCountryCode", lat, lng, useCountryCode);
};
// and use it to get the name, population, capital, area, currency and flag info
const useCountryCode = (data) => {
  country.iso2 = data.data;
  callApi("getCountryInfo", "en", country.iso2, getBasicData);
};

const getBasicData = (data) => {
  let results = data.data[0];
  country.population = parseFloat(results.population / 1000000);
  country.countryName = results.countryName;
  country.currency = results.currencyCode;
  country.capital = results.capital;
  country.flag = `https://www.countryflags.io/${country.iso2}/shiny/48.png`;
  let screenCheck = window.matchMedia("(min-width: 400px)");
  if (screenCheck.matches) {
    country.flag = `https://www.countryflags.io/${country.iso2}/shiny/64.png`;
  }
  country.area = Math.round(results.areaInSqKm).toLocaleString("en-US");

  $("#titleCountry").html(country.countryName);
  $("#flag").attr("src", country.flag);
  displayTopLevel();
  
  if(click === true) {
    console.log(clickLocationLat, clickLocationLng)
  callApi("getPlaceInfo", clickLocationLat, clickLocationLng, zoomToPlace);
  } else {
    console.log(country.capital)
  callApi("getCapitalCoords", country.capital, "", zoomToCapital);
  }

  
};

const displayTopLevel = () => {
  $("#item-A").html(country.countryName);
  $("#flag2").attr("src", country.flag);

  $("#item-B").html("Capital:");
  $("#item-2").html(country.capital);
  $("#item-C").html("Population:");
  $("#item-3").html(country.population.toFixed(2) + "m");
  $("#item-D").html("Currency:");
  $("#item-4").html(country.currency);
  $("#item-E").html("Area:");
  $("#item-5").html(`${country.area} km2`);
};

// the first time the weather button is clicked get the weather info
const getWeatherData = (data) => {
  let results = data.data;
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
  largeScreenCheck.matches ? 
  $("#item-B").html(`<img src="http://openweathermap.org/img/wn/${country.weathericon}@2x.png" alt="Weather icon">`) :
  $("#item-B").html(`<img src="http://openweathermap.org/img/wn/${country.weathericon}.png" alt="Weather icon">`); 
  $("#item-2").html(country.weatherDescription);
  $("#item-C").html("Max Temp:");
  $("#item-3").html(`${country.maxtemp}&#176;C`);
  $("#item-D").html("Min Temp:");
  $("#item-4").html(`${country.mintemp}&#176;C`);
  $("#item-E").html("Wind Speed:");
  $("#item-5").html(`${country.windspeed} mph`);
};

// the first time the virus button is clicked get data
const getVirusData = (data) => {
  let results = data.data;
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

const getMoneyData = (data) => {
  let results = data.data.conversion_rates;
  country.USDexchange = results.USD;
  country.EURexchange = results.EUR;
  country.GBPexchange = results.GBP;
  country.JPYexchange = results.JPY;
  displayMoney();
};

const displayMoney = () => {
  $("#item-A").html(`Exchange Rate for ${country.currency}`);

  $("#item-B").html("US Dollars $:");
  $("#item-2").html(country.USDexchange);
  $("#item-C").html("Euros &#8364;:");
  $("#item-3").html(country.EURexchange);
  $("#item-D").html("GB Pounds £:");
  $("#item-4").html(country.GBPexchange);
  $("#item-E").html("JP Yen &#165;:");
  $("#item-5").html(country.JPYexchange);
};

const getNews = (data) => {
  let results = data.data;
  country.newsTitle = results[0][0] ? results[0][0] : "";
  country.newsTitle2 = results[1][0] ? results[1][0] : "";
  country.newsTitle3 = results[2][0] ? results[2][0] : "";
  country.newsTitle4 = results[3][0] ? results[3][0] : "";
  country.newsLink = results[0][1];
  country.newsLink2 = results[1][1];
  country.newsLink3 = results[2][1];
  country.newsLink4 = results[3][1];
  country.newsImage = results[0][2]
    ? results[0][2]
    : "./libs/css/news-blue.png";
  country.newsImage2 = results[1][2]
    ? results[1][2]
    : "./libs/css/news-blue.png";
  country.newsImage3 = results[2][2]
    ? results[2][2]
    : "./libs/css/news-blue.png";
  country.newsImage4 = results[3][2]
    ? results[3][2]
    : "./libs/css/news-blue.png";
  displayNews();
};

const displayNews = () => {
  $("#item-A").html(`Latest News`);
  $("#item-B").html(
    `<a href=${country.newsLink} target="_blank"><img class="newsImage" src=${country.newsImage}></a>`
  );
  $("#item-2").html(country.newsTitle);
  $("#item-C").html(
    `<a href=${country.newsLink2} target="_blank"><img class="newsImage" src=${country.newsImage2}></a>`
  );
  $("#item-3").html(country.newsTitle2);
  $("#item-D").html(
    `<a href=${country.newsLink3} target="_blank"><img class="newsImage" src=${country.newsImage3}></a>`
  );
  $("#item-4").html(country.newsTitle3);
  $("#item-E").html(
    `<a href=${country.newsLink4} target="_blank"><img class="newsImage" src=${country.newsImage4}></a>`
  );
  $("#item-5").html(country.newsTitle4);
};


const displayMarkers = (data) => {
  console.log(`hello did you get here ${data.data}`)
	let results = data.data;
  let markers = L.markerClusterGroup();

results.map((touristAttraction) => { 
		let cafeMarker = L.marker(touristAttraction[1]).addTo(map).bindPopup(`	&#9749; This is ${touristAttraction[0]}`)
    markers.addLayer(cafeMarker);

	})

  console.log(markers)
  map.addLayer(markers);
}



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
