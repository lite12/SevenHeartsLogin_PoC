<?
	if (!isset($_SESSION)) { session_start(); }
	$th = array('eldeon','junon','eldeon'); 
	$_SESSION['th'] = $th[array_rand($th, 1)];
?>