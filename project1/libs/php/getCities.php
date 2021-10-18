<?php

include('config.php');

$executionStartTime = microtime(true);

$url='http://api.geonames.org/findNearbyPlaceNameJSON?lat=' . $_REQUEST['param1'] . '&lng=' . $_REQUEST['param2'] . '&lang=en&radius=300&maxRows=5000&localCountry=true&cities=cities15000&username='  . $geonameKey;
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);
curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $decode['geonames'];

print_r(json_encode($output));

header('Content-Type: application/json; charset=UTF-8');

?>
