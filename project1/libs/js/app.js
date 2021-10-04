import {jawgKey} from './config.js';

//Set up country object with all the info options
let country = {
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
	weatherDescription: "",
	activeCovidCases: 0,
	criticalCovidcases: 0,
	totalCovidCases: 0, 
	totalCovidDeaths: 0,
} 

//Set up Leaflet maps
let map = L.map('map').fitWorld();

//using Jawg Streets
let mapDesign = L.tileLayer('https://{s}.tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 22,
	subdomains: 'abcd',
	accessToken: jawgKey,
	crossOrigin: ""
});

mapDesign.addTo(map);
map.locate({setView: true, maxZoom: 4});

//On load find the user's location
const onLocationFound = (e) => {
    let radius = e.accuracy;
     L.circle(e.latlng, radius).addTo(map);
	 console.log(e.latlng.lat, e.latlng.lng);
	 getCountryCode(e.latlng.lat, e.latlng.lng);
	 }

map.on('locationfound', onLocationFound);
function onLocationError(e) {
    alert(e.message);
}
map.on('locationerror', onLocationError);

// Set up buttons to open and close modal and call Api if necessary
$('#closeModal').click(function(){
	$('#modal').hide()
	});

$('#homebutton').click(function(){
		displayTopLevel()
		$('#modal').show()
});

$('#weatherIcon').click(function(){
	if (country.weatherDescription) {
		displayWeather()	
	} else {
	callApi('getWeather', country.capital, 'metric', getWeatherData)
	} $('#modal').show()
});


$('#virusIcon').click(function(){
	if (country.totalCovidCases) {
		displayVirus()	
	} else {
	callApi('getVirus', country.iso2, false, getVirusData)
	} $('#modal').show()
});

$('#moneyIcon').click(function(){
	$('#modal').show()
});

$('#transportIcon').click(function(){
	$('#modal').show()
});

//Once we have coordinates we can get the country code
const getCountryCode = (lat, lng) => {
	callApi('getCountryCode', lat, lng, useCountryCode)
	}
// and use it to get the name, population, capital, area, currency and flag info
const useCountryCode = (data) => {
	country.iso2 = data.data;
	callApi('getCountryInfo', 'en', country.iso2, getBasicData);
}

const getBasicData = (data) => {
	let results = data.data[0]
	country.population = parseFloat(results.population / 1000000);
	country.countryName = results.countryName;
	country.currency = results.currencyCode;
	country.capital = results.capital;
	country.flag = `https://www.countryflags.io/${country.iso2}/shiny/32.png`;
	country.area = Math.round(results.areaInSqKm).toLocaleString("en-US");

	$('#titleCountry').html(country.countryName);
	$('#flag').attr("src", country.flag);
	displayTopLevel()

}

const displayTopLevel = () => {
	$('#item-A').html("The Basics");

	$('#item-B').html("Capital:");
	$('#item-2').html(country.capital);
	$('#item-C').html("Population:");
	$('#item-3').html(country.population.toFixed(2) + 'm');
	$('#item-D').html("Currency:");
	$('#item-4').html(country.currency);
	$('#item-E').html("Area:");
	$('#item-5').html(`${country.area} km2`);
}

// the first time the weather button is clicked get the weather info
const getWeatherData = (data) => {
	let results = data.data;
	country.weatherDescription = results.weather[0].description;
	country.maxtemp = results.main.temp_max;
	country.mintemp = results.main.temp_min;
	country.windspeed = parseFloat(results.wind.speed);
	country.windspeed = (2.23694 * country.windspeed).toFixed(2);
	displayWeather()
}
	
const displayWeather = () => {
	$('#item-A').html("The Weather");

	$('#item-B').html("Conditions:");
	$('#item-2').html(country.weatherDescription);
	$('#item-C').html("Max Temp:");
	$('#item-3').html(`${country.maxtemp}&#8451;`);
	$('#item-D').html("Min Temp:");
	$('#item-4').html(`${country.mintemp}&#8451;`);
	$('#item-E').html("Wind Speed:");
	$('#item-5').html(`${country.windspeed} mph`);
}

// the first time the virus button is clicked get data
const getVirusData = (data) => {
	let results = data.data;
	country.activeCovidCases = results.active.toLocaleString("en-US");
	country.criticalCovidcases = results.critical.toLocaleString("en-US");
	country.totalCovidCases = results.cases.toLocaleString("en-US");
	country.totalCovidDeaths = results.deaths.toLocaleString("en-US");
	displayVirus()
}

const displayVirus = () => {
	$('#item-A').html("Coronavirus Data");

	$('#item-B').html("Active cases:");
	$('#item-2').html(country.activeCovidCases);
	$('#item-C').html("Critical cases:");
	$('#item-3').html(country.criticalCovidcases);
	$('#item-D').html("Total cases:");
	$('#item-4').html(country.totalCovidCases);
	$('#item-E').html("Total deaths:");
	$('#item-5').html(country.totalCovidDeaths);
}

//Generic function for API call 
const callApi = (phpToCall, parameter1, parameter2, callbackFun) => {
	const apiUrl = `libs/php/${phpToCall}.php`	
	$.ajax({
		url: apiUrl,
        type: 'POST',
        dataType: 'json',
        data: {
            param1: parameter1,
            param2: parameter2,
		}, 
		success: function(result) {
			callbackFun(result)
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(`ajax call failed ${textStatus}`) 
		}
});
}
