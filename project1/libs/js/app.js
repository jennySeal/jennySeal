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
} 

//Set up Leaflet maps
let map = L.map('map').fitWorld();

//using Jawg Streets
let mapDesign = L.tileLayer('https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 22,
	subdomains: 'abcd',
	accessToken: jawgKey,
	crossOrigin: ""
});

mapDesign.addTo(map);
let largeScreenCheck = window.matchMedia( '(min-width: 1000px)' );
	(largeScreenCheck.matches) ? map.locate({setView: true, maxZoom: 5}) : map.locate({setView: true, maxZoom: 4});



//On load find the user's location

const onLocationFound = (e) => {
	getSelectData()
    let radius = e.accuracy;
     L.circle(e.latlng, radius).addTo(map);
	 getCountryCode(e.latlng.lat, e.latlng.lng);
	 }

map.on('locationfound', onLocationFound);
function onLocationError(e) {
    alert(e.message);
}
map.on('locationerror', onLocationError);

// Set up buttons to open and close modal and call Api if necessary

$('#closeModal').click(function(){
	$('#modal').slideUp("fast", function() {
	})
	});

$('#homebutton').click(function(){
		displayTopLevel()
		$('#modal').slideDown("slow", function() {
			console.log('Hi Jenny3')})
});

$('#weatherIcon').click(function(){
	callApi('getWeather', country.capital, 'metric', getWeatherData)
	 $('#modal').slideDown("slow", function() {

	})
});

$('#virusIcon').click(function(){
	callApi('getVirus', country.iso2, false, getVirusData)
	 $('#modal').slideDown("slow", function() {

	})
});

$('#moneyIcon').click(function(){
	callApi('getMoney', country.currency, '', getMoneyData)
	 $('#modal').slideDown("slow", function() {

	})
});

$('#newsIcon').click(function(){
callApi('getNews', country.iso2, '', getNews)
	 $('#modal').slideDown("slow", function(){
	})
});

/*Set up the select list from the countryBorders.geo.json - returns an array of arrays with name and iso2
 of each country.*/

const getSelectData = () => {
	callApi('getSelectData', '', '', displaySelectData);
}

const displaySelectData = (data) => {
	let results = data.data;
	for (let i=0; i<results.length; i++) {
		let selectOption = results[i][0];
		let isoOption = results[i][1];
	$('#countrySelect').append(`<option value="${isoOption}">${selectOption}</option>`);
	}
}

$("#countrySelect").change(function() {
	country.iso2 = $("#countrySelect option:selected").val();
		callApi('getCountryInfo', 'en', country.iso2, getBasicData);
	

})

const zoomToCapital = (data) => {
	let results = data.data;
	let lat = results.lat;
	let lng = results.lng;
	let sunrise = data.sunrise;


   let date = new Date(sunrise * 1000); 
   let hours = date.getUTCHours().toString().padStart(2,0);
   let minutes = date.getUTCMinutes().toString().padStart(2,0);
   let seconds = date.getUTCSeconds().toString().padStart(2,0);
   


	let mapOptions = {
		lat: lat, 
		lng: lng,
		zoom: 7
	}
	map.flyTo(mapOptions)
	L.marker([lat, lng]).addTo(map).bindPopup(`The capital of ${country.countryName} is ${country.capital}. <br>The sun rose at ${hours}:${minutes}:${seconds}`);
}


//Once we have coordinates we can get the country code
const getCountryCode = (lat, lng) => {
	console.log('hello', lat);
	callApi('getCountryCode', lat, lng, useCountryCode)
	}
// and use it to get the name, population, capital, area, currency and flag info
const useCountryCode = (data) => {
	console.log('hello2', data);
	country.iso2 = data.data;
	callApi('getCountryInfo', 'en', country.iso2, getBasicData);
}

const getBasicData = (data) => {
	let results = data.data[0];
	console.log(data)
	country.population = parseFloat(results.population / 1000000);
	country.countryName = results.countryName;
	country.currency = results.currencyCode;
	country.capital = results.capital;
	country.flag = `https://www.countryflags.io/${country.iso2}/shiny/48.png`;
	let screenCheck = window.matchMedia( '(min-width: 400px)' );
	if (screenCheck.matches) {
		country.flag = `https://www.countryflags.io/${country.iso2}/shiny/64.png`;
	}
	country.area = Math.round(results.areaInSqKm).toLocaleString("en-US");

	$('#titleCountry').html(country.countryName);
	$('#flag').attr("src", country.flag);
	console.log('hello3', results.countryName);
		displayTopLevel()
		callApi('getCapitalCoords', country.capital, '', zoomToCapital)

}

const displayTopLevel = () => {
	$('#item-A').html(country.countryName);
	$('#flag2').attr("src", country.flag);

	$('#item-B').html("Capital:");
	$('#item-2').html(country.capital);
	$('#item-C').html("Population:");
	$('#item-3').html(country.population.toFixed(2) + 'm');
	$('#item-D').html("Currency:");
	$('#item-4').html(country.currency);
	$('#item-E').html("Area:");
	$('#item-5').html(`${country.area} km2`);
		console.log('hello4', country.countryName)
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
	$('#item-A').html("The Weather Today");

	$('#item-B').html("Conditions:");
	$('#item-2').html(country.weatherDescription);
	$('#item-C').html("Max Temp:");
	$('#item-3').html(`${country.maxtemp}&#176;C`);
	$('#item-D').html("Min Temp:");
	$('#item-4').html(`${country.mintemp}&#176;C`);
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
	$('#item-A').html("Coronavirus Rates");

	$('#item-B').html("Active cases:");
	$('#item-2').html(country.activeCovidCases);
	$('#item-C').html("Critical cases:");
	$('#item-3').html(country.criticalCovidcases);
	$('#item-D').html("Total cases:");
	$('#item-4').html(country.totalCovidCases);
	$('#item-E').html("Total deaths:");
	$('#item-5').html(country.totalCovidDeaths);
}

const getMoneyData = (data) => {
	let results = data.data.conversion_rates;
	country.USDexchange = results.USD;
	country.EURexchange = results.EUR;
	country.GBPexchange = results.GBP;
	country.JPYexchange = results.JPY;
	displayMoney()
}

const displayMoney = () => {
	$('#item-A').html(`Exchange Rate for ${country.currency}`);

	$('#item-B').html("US Dollars $:");
	$('#item-2').html(country.USDexchange);
	$('#item-C').html("Euros &#8364;:");
	$('#item-3').html(country.EURexchange);
	$('#item-D').html("GB Pounds £:");
	$('#item-4').html(country.GBPexchange);
	$('#item-E').html("JP Yen &#165;:");
	$('#item-5').html(country.JPYexchange);
}

const getNews = (data) => {
    console.log(data)
	let results = data.data;
	country.newsTitle = (results[0][0]) ? results[0][0] : "";
	country.newsTitle2 = (results[1][0]) ? results[1][0] : "";
	country.newsTitle3 = (results[2][0]) ? results[2][0] : "";
	country.newsTitle4 = (results[3][0]) ? results[3][0] : "";
	country.newsLink = results[0][1];
	country.newsLink2 = results[1][1];
	country.newsLink3 = results[2][1];
	country.newsLink4 = results[3][1];
	country.newsImage = (results[0][2]) ? results[0][2] : './libs/css/news-blue.png';
	country.newsImage2 = (results[1][2]) ? results[1][2] : './libs/css/news-blue.png';
	country.newsImage3 = (results[2][2]) ? results[2][2] : './libs/css/news-blue.png';
	country.newsImage4 = (results[3][2]) ? results[3][2] : './libs/css/news-blue.png';
	displayNews()
}

const displayNews = () => {
	$('#item-A').html(`Latest News`);
	$('#item-B').html(`<a href=${country.newsLink} target="_blank"><img class="newsImage" src=${country.newsImage}></a>`);
	$('#item-2').html(country.newsTitle);
	$('#item-C').html(`<a href=${country.newsLink2} target="_blank"><img class="newsImage" src=${country.newsImage2}></a>`);
	$('#item-3').html(country.newsTitle2);
	$('#item-D').html(`<a href=${country.newsLink3} target="_blank"><img class="newsImage" src=${country.newsImage3}></a>`);
	$('#item-4').html(country.newsTitle3);
	$('#item-E').html(`<a href=${country.newsLink4} target="_blank"><img class="newsImage" src=${country.newsImage4}></a>`);
	$('#item-5').html(country.newsTitle4);
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
