<?
	// Randomizes theme elements.
	$th = array('eldeon','junon','eldeon'); 
	if (!isset($_SESSION)) { 
		session_start(); 
	}
	$_SESSION['th'] = $th[array_rand($th, 1)];
?>
