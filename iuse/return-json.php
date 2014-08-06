<?php 
session_start();
//include('./DBConn.php');
include('./ReadCsv.php');

if(isset($_POST['csvFile']) || isset($_POST['csvInput'])) { 
	if (isset($_POST['csvFile'])) {
		$params = array(
			'csvFile' => $_POST['csvFile'], 
		);	
	}
	
	if (isset($_POST['csvInput'])) {
		$params = array(
			'csvInput' => $_POST['csvInput'], 
		);	
	}
	
	$result = new ReadCsv($params);
	$json = $result->returnJson();

	if (!empty($json) AND ((isset($_POST['csvFile']) AND preg_match('/uploaded/', $_POST['csvFile'])) || isset($_POST['csvInput'])) ) {
	    //$conn = new DBConn();
	    //$uid['uid'] = $conn->insertIntoDB($json);
        $new_json = (array) json_decode($json);
        //$new_json['uid'] = $conn->insertIntoDB($json);
        $json = json_encode($new_json);
        //echo json_encode($uid['uid']);
	}
	
}

echo $json;
$_SESSION['return_json'] = $json;
?>