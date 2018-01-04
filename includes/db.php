<?
	$conn = new mysqli('localhost', 'root', '', 'webdb');

	/* MySQLi Database Host: Connection Check */
	if ($conn->connect_errno) {
	    echo "MySQLi: Connection failed (" . $conn->connect_errno . ") " . $conn->connect_error;
	    exit();
	}	
?>