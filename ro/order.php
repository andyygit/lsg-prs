<?php

try
{
	//These parameters are needed to be optimalise depending on the environment:
	ini_set('memory_limit','1024M');
	ini_set('max_execution_time', 600);
	
	date_default_timezone_set("Europe/Bucharest");
	
	//The service URL:
	$url = 'https://api.mygls.ro/SERVICE_NAME.svc/';
	
	//Test ClientNumber:
	$clientNumber = ?; //!!!NOT FOR CUSTOMER TESTING, USE YOUR OWN, USE YOUR OWN!!!
	//Test username:
	$username = ""; //!!!NOT FOR CUSTOMER TESTING, USE YOUR OWN, USE YOUR OWN!!!
	//Test password:
	$pwd = ""; //!!!NOT FOR CUSTOMER TESTING, USE YOUR OWN, USE YOUR OWN!!!
	
	$isXmlFormat = false;

	$url .= "json/";

	$password = "[".implode(',',unpack('C*', hash('sha512', $pwd, true)))."]";
	
	// $pickupDate = "\/Date(".(strtotime("+1 hour") * 1000).")\/";
	
	$parcels = $_POST["apidata"];

	//Parcel service:
	$serviceName = "ParcelService";
	
	PrintLabels($username,$password,str_replace("SERVICE_NAME",$serviceName,$url),"PrintLabels",$parcels,$isXmlFormat);
	
}
catch (Exception $e)
{
    echo $e->getMessage();
}

/*
* Label(s) generation by the service.
*/
function PrintLabels($username,$password,$url,$method,$parcels,$isXmlFormat)
{	
	//Test request:
	$request = GetRequestString($username,$password,$parcels,$isXmlFormat,$method);

	$response = GetResponse($url,$method,$request,$isXmlFormat);

	if($response == true && count(json_decode($response)->PrintLabelsErrorList) == 0 && count(json_decode($response)->Labels) > 0)
	{		
		// echo json_encode(array("message" => json_decode($response)->PrintLabelsInfoList));
		//Label(s) saving:
		$pdf = implode(array_map('chr', json_decode($response)->Labels));
		header('Content-Type: application/pdf');
		echo $pdf;
		
		// file_put_contents('php_rest_client_'.$method.'.pdf', $pdf);
	} else {
		echo json_encode(array("message" => json_decode($response)->PrintLabelsErrorList));
	}
}

//Utility functions:

function GetRequestString($username,$password,$dataList,$isXmlFormat,$requestObjectName)
{
	$result = '{"Username":"'.$username.'","Password":'.$password.',"ParcelList":'.$dataList.',"PrintPosition":1,"ShowPrintDialog":0}';
	return $result;
}

function GetResponse($url,$method,$request,$isXmlFormat)
{	
	//Service calling:
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_POST, 1);
	curl_setopt($curl, CURLOPT_URL, $url.$method);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($curl, CURLOPT_TIMEOUT, 600);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
	curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
	curl_setopt($curl, CURLOPT_POSTFIELDS, $request);
	curl_setopt($curl, CURLOPT_HTTPHEADER, array(
		'Content-Type: application/json',
		'Content-Length: ' . strlen($request))
	);
	
	$response = curl_exec($curl);	
	
	if(curl_getinfo($curl)["http_code"] == "401")
	{
		die("Unauthorized");
	}
	
	if ($response === false)
	{
		die('curl_error:"' . curl_error($curl) . '";curl_errno:' . curl_errno($curl));
	}
	curl_close($curl);
	
	return $response;
}