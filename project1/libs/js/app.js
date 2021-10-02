import {jawgKey} from './config.js';
//Set up Leaflet maps
let map = L.map('map').fitWorld();

//using Jawg Streets
let mapDesign = L.tileLayer('https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 22,
	subdomains: 'abcd',
	accessToken: jawgKey,
	crossOrigin: ""
});

mapDesign.addTo(map);
map.locate({setView: true, maxZoom: 5});

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

//Once we have coordinates we can get the country code
const getCountryCode = (lat, lng) => {
	callApi('getCountryCode', lat, lng, useCountryCode)
	}
// and use it to get top level info
const useCountryCode = (data) => {
	console.log(data.data)
}


//Generic function for API call 
const callApi = (phpToCall, parameter1, parameter2, callbackFun) => {
	const apiUrl = `libs/php/${phpToCall}.php`	
	$.ajax({
		url: apiUrl,
        type: 'POST',
        dataType: 'json',
        data: {
            lat: parameter1,
            lng: parameter2,
		}, 
		success: function(result) {
			callbackFun(result)
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(`ajax call failed ${textStatus}`) 
		}
});
}
