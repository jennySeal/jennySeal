<?php

include('config.php');

$executionStartTime = microtime(true);

$url='https://trueway-places.p.rapidapi.com/FindPlacesNearby?location=' . $_REQUEST['param1'] . ',' . $_REQUEST['param2'] &type=train_station&radius=10000&language=en";
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


header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);

?>
