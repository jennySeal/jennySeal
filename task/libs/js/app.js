$(window).on('load', function () {
    if ($('#preloader').length) {
        $('#preloader').delay(1000).fadeOut('slow',function () {
            $(this).remove();
        });
    }
});

$('#OceanBtn').click(function() {
    $.ajax({
        url: "libs/php/getOcean.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#oceanlat').val(),
            lng: $('#oceanlng').val(),
        },
            success: function(result) {
                console.log(result);

            if (result.status.name == "ok") {
                if (result.data.ocean === null) {
                    $('#oceanName').html('There is no ocean or sea at these coordinates.');
                } else {
					$('#oceanName').html(`These coordinates are in the ${result.data.ocean.name}.`);
                }

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`Error`);
    }
}); 
});

$('#WeatherBtn').click(function() {
    $.ajax({
        url: "libs/php/getWeather.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#weatherlat').val(),
            lng: $('#weatherlng').val(),
        },
            success: function(result) {
                console.log(result);

            if (result.status.name == "ok") {
                console.log(result.data.weatherObservation);
                if (result.data.weatherObservation == null) {
                    $('#weatherInfo').html('There is no weather station within 100km of these coordinates.');
                } else {
					$('#weatherInfo').html(`The nearest weather station is ${result.data.weatherObservation.stationName} 
                    in ${result.data.weatherObservation.countryCode}. The last observation was taken on ${result.data.weatherObservation.datetime} 
                    and the temperature is ${result.data.weatherObservation.temperature}, humidity is ${result.data.weatherObservation.humidity},
                    windspeed is ${result.data.weatherObservation.windSpeed} and
                    ${result.data.weatherObservation.clouds}.`);
                }

            }
            },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`Error`);
    }
});
});

$('#ElevationBtn').click(function() {
    $.ajax({
        url: "libs/php/getElevation.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#elevationlat').val(),
            lng: $('#elevationlng').val(),
        },
            success: function(result) {
                console.log(result);

            if (result.status.name == "ok") {
                
                if (result.data === -32768) {
                    $('#elevationData').html('These coordinates are in the ocean so there is no elevation data.');
                } else {
					$('#elevationData').html(`The radar onboard Space Shuttle Endeavour measured the 
                    elevation of this point to be ${result.data} meters.`);
                }
            }
            },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`Error`);
    }
});
});