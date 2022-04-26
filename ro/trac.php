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
	
    $input = $_POST['awb'];

	//Parcel service:
	$serviceName = "ParcelService";
	
	GetParcelStatuses($username,$password,str_replace("SERVICE_NAME",$serviceName,$url),"GetParcelStatuses",$isXmlFormat,$input);
	
}
catch (Exception $e)
{
    echo $e->getMessage();
}

/*
* Get parcel statuses.
*/
function GetParcelStatuses($username,$password,$url,$method,$isXmlFormat,$parcelNumber)
{
	$request = '{"Username":"'.$username.'","Password":'.$password.',"ParcelNumber":'.$parcelNumber.',"ReturnPOD":false,"LanguageIsoCode":"RO"}';
		
	$response = GetResponse($url,$method,$request,$isXmlFormat);
	
	if($response == true)
	{
		if(count(json_decode($response)->GetParcelStatusErrors) == 0)
		{				
			$msg = 'Colet nelivrat';
			$statuses = json_decode($response)->ParcelStatusList;
			foreach ($statuses as $status) {
				if ($status->StatusCode == "5") {
					$msg = 'Coletul este livrat';
				}
			}
		} else {
			// $errors = json_decode($response)->GetParcelStatusErrors;
			// foreach ($errors as $error) {
			// 	echo $error->ErrorDescription;
			// }
			$msg = 'Colet inexistent';
		}
		echo json_encode(array(
			'msg' => $msg
		));
	}
}

//Utility functions:

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