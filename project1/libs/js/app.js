import {jawgKey} from './config.js';

//Set up country object with all the info options
let country = {
	iso2: "", 
	population: 0,
	countryName: "", 
	currency: "",
	capital: "",
	flag: "",
	area: 0
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
	 getCountryCode(e.latlng.lat, e.latlng.lng);
	 }

map.on('locationfound', onLocationFound);
function onLocationError(e) {
    alert(e.message);
}
map.on('locationerror', onLocationError);

// Set up buttons to open and close modal
$('#closeModal').click(function(){
	$('#modal').hide()
	});

$('#homebutton').click(function(){
	$('#modal').show()
});


// ************************START HERE *************************

$('#weatherIcon').click(function(){
	callApi('getWeatherInfo', 'en', country.iso2, writeTopLevel);
	$('#modal').show()
});

$('#virusIcon').click(function(){
	$('#modal').show()
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
	callApi('getCountryInfo', 'en', country.iso2, writeTopLevel);
}

const writeTopLevel = (data) => {
	let results = data.data[0]
	country.population = parseFloat(results.population / 1000000);
	country.countryName = results.countryName;
	country.currency = results.currencyCode;
	country.capital = results.capital;
	country.flag = `https://www.countryflags.io/${country.iso2}/shiny/32.png`;
	country.area = results.areaInSqKm;

	$('#titleCountry').html(country.countryName);
	$('#capital').html(country.capital);
	$('#population').html(country.population.toFixed(2));
	$('#currency').html(country.currency);
	$('#flag').attr("src", country.flag);
	$('#area').html(country.area);
}

// once the weather button is clicked get the weather info




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
