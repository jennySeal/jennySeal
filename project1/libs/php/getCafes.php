<?php

include('config.php');

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$curl = curl_init();
curl_setopt_array($curl, [
	CURLOPT_URL => "https://trueway-places.p.rapidapi.com/FindPlacesNearby?location=" . $_REQUEST['param1'] . "," . $_REQUEST['param2'] . "&type=cafe&radius=100000&language=en",
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
	CURLOPT_HTTPHEADER => [
		"x-rapidapi-host: trueway-places.p.rapidapi.com",
		"x-rapidapi-key: $truewayKey"
	],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
	echo "cURL Error #:" . $err;
} else {


$decode = json_decode($response, true);

$touristAttraction = array();
foreach ($decode["results"] as $touristPlace) {
    array_push($touristAttraction, array($touristPlace["name"], $touristPlace["location"],$touristPlace["types"]["0"]));
}




$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $touristAttraction;


header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
}
?>
