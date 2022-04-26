<?php

$loadedXml = simplexml_load_file(dirname(__FILE__).'/cities_ro.xml');

$keyword = $_POST['keyword'];


$lowerCity = strtolower($keyword);
$convertKeyword =  str_replace(array("ă","â","î","ș","ț"," "),array("a","a","i","s","t",""),$lowerCity);

$convertKeyword = explode(',', $convertKeyword);

$convertedCity = $convertKeyword[0];
$convertedStreet = '';

if (isset($convertKeyword[1])) {
	$convertedStreet = $convertKeyword[1];
}

$zipFound = $loadedXml->xpath("/ArrayOfZCR/ZCR[
	contains(translate(@City, 'ABCDEFGHIJKLMNOPQRSTUVWXYZăĂâÂîÎșȘțȚ', 'abcdefghijklmnopqrstuvwxyzaaaaiisstt'),'$convertedCity') and (contains(translate(@Street, 'ABCDEFGHIJKLMNOPQRSTUVWXYZăĂâÂîÎșȘțȚ ', 'abcdefghijklmnopqrstuvwxyzaaaaiisstt'),'$convertedStreet') or contains(translate(@County, 'ABCDEFGHIJKLMNOPQRSTUVWXYZăĂâÂîÎșȘțȚ', 'abcdefghijklmnopqrstuvwxyzaaaaiisstt'),'$convertedStreet'))]");

$cities= array();
foreach ($zipFound as $key => $row) {
	$attributes = $row->attributes();
	if ($key < 50) {
		$cities[] = array(
			'zip_code' => $attributes['ZipCode'],
			'city' => $attributes['City'],
			'street' => $attributes['Street'],
			'county' => $attributes['County']
		);
	}
}

echo json_encode($cities);



